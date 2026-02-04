import json
import os
import psycopg2
from typing import Optional

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''API для управления привязкой провайдеров авторизации к аккаунту пользователя'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }
    
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    if not auth_header or not auth_header.startswith('Bearer '):
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    token = auth_header.replace('Bearer ', '')
    user_id = verify_token(token)
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid token'})
        }
    
    if method == 'GET':
        return get_user_providers(user_id)
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        return link_provider(user_id, body)
    elif method == 'DELETE':
        params = event.get('queryStringParameters', {})
        provider = params.get('provider')
        return unlink_provider(user_id, provider)
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }

def verify_token(token: str) -> Optional[int]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT user_id FROM sessions WHERE token = %s AND expires_at > NOW()",
                (token,)
            )
            result = cur.fetchone()
            return result[0] if result else None
    finally:
        conn.close()

def get_user_providers(user_id: int) -> dict:
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                '''SELECT provider, provider_user_id, provider_email, linked_at 
                   FROM user_providers 
                   WHERE user_id = %s 
                   ORDER BY linked_at DESC''',
                (user_id,)
            )
            rows = cur.fetchall()
            
            providers = []
            for row in rows:
                providers.append({
                    'provider': row[0],
                    'providerId': row[1],
                    'email': row[2],
                    'linkedAt': row[3].isoformat() if row[3] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'providers': providers})
            }
    finally:
        conn.close()

def link_provider(user_id: int, data: dict) -> dict:
    provider = data.get('provider')
    provider_user_id = data.get('providerId')
    provider_email = data.get('email')
    provider_data = data.get('data', {})
    
    if not provider or not provider_user_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Provider and providerId are required'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                '''INSERT INTO user_providers 
                   (user_id, provider, provider_user_id, provider_email, provider_data) 
                   VALUES (%s, %s, %s, %s, %s)
                   ON CONFLICT (user_id, provider) 
                   DO UPDATE SET 
                       provider_user_id = EXCLUDED.provider_user_id,
                       provider_email = EXCLUDED.provider_email,
                       provider_data = EXCLUDED.provider_data,
                       linked_at = CURRENT_TIMESTAMP''',
                (user_id, provider, provider_user_id, provider_email, json.dumps(provider_data))
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Provider linked successfully'})
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        conn.close()

def unlink_provider(user_id: int, provider: str) -> dict:
    if not provider:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Provider is required'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'SELECT COUNT(*) FROM user_providers WHERE user_id = %s',
                (user_id,)
            )
            count = cur.fetchone()[0]
            
            if count <= 1:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Cannot unlink last provider'})
                }
            
            cur.execute(
                'SELECT id FROM user_providers WHERE user_id = %s AND provider = %s',
                (user_id, provider)
            )
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Provider not found'})
                }
            
            provider_id = result[0]
            cur.execute('UPDATE user_providers SET provider = NULL WHERE id = %s', (provider_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Provider unlinked successfully'})
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        conn.close()
