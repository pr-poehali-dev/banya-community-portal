import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для регистрации, входа и проверки авторизации пользователей'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'POST':
        if path == 'register':
            return register_user(event)
        elif path == 'login':
            return login_user(event)
        elif path == 'telegram':
            return telegram_login(event)
    elif method == 'GET':
        if path == 'verify':
            return verify_session(event)
    
    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Invalid action'}),
        'isBase64Encoded': False
    }

def get_db_connection():
    '''Создаёт соединение с базой данных'''
    return psycopg2.connect(
        os.environ['DATABASE_URL'],
        cursor_factory=RealDictCursor,
        options=f"-c search_path={os.environ['MAIN_DB_SCHEMA']}"
    )

def hash_password(password: str) -> str:
    '''Хеширует пароль с использованием SHA-256'''
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    '''Генерирует случайный токен для сессии'''
    return secrets.token_urlsafe(32)

def register_user(event: dict) -> dict:
    '''Регистрация нового пользователя'''
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        full_name = body.get('full_name', '').strip()
        phone = body.get('phone', '').strip()
        
        if not email or not password or not full_name:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Email, пароль и имя обязательны'}),
                'isBase64Encoded': False
            }
        
        if len(password) < 6:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Пользователь с таким email уже существует'}),
                'isBase64Encoded': False
            }
        
        password_hash = hash_password(password)
        
        cursor.execute(
            "INSERT INTO users (email, password_hash, full_name, phone) VALUES (%s, %s, %s, %s) RETURNING id, email, full_name",
            (email, password_hash, full_name, phone if phone else None)
        )
        user = cursor.fetchone()
        conn.commit()
        
        token = generate_token()
        expires_at = datetime.now() + timedelta(days=30)
        
        cursor.execute(
            "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user['id'], token, expires_at)
        )
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Регистрация успешна',
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'full_name': user['full_name']
                }
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }

def login_user(event: dict) -> dict:
    '''Вход пользователя в систему'''
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        
        if not email or not password:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Email и пароль обязательны'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        password_hash = hash_password(password)
        
        cursor.execute(
            "SELECT id, email, full_name FROM users WHERE email = %s AND password_hash = %s",
            (email, password_hash)
        )
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Неверный email или пароль'}),
                'isBase64Encoded': False
            }
        
        token = generate_token()
        expires_at = datetime.now() + timedelta(days=30)
        
        cursor.execute(
            "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user['id'], token, expires_at)
        )
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Вход успешен',
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'full_name': user['full_name']
                }
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }

def verify_session(event: dict) -> dict:
    '''Проверка действительности токена сессии'''
    try:
        auth_header = event.get('headers', {}).get('X-Authorization', '')
        token = auth_header.replace('Bearer ', '').strip()
        
        if not token:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Токен не предоставлен'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            '''SELECT s.user_id, s.expires_at, u.email, u.full_name 
               FROM sessions s 
               JOIN users u ON s.user_id = u.id 
               WHERE s.token = %s''',
            (token,)
        )
        session = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not session:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Недействительный токен'}),
                'isBase64Encoded': False
            }
        
        if datetime.now() > session['expires_at']:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Токен истёк'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'valid': True,
                'user': {
                    'id': session['user_id'],
                    'email': session['email'],
                    'full_name': session['full_name']
                }
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }

def telegram_login(event: dict) -> dict:
    '''Авторизация через Telegram'''
    try:
        body = json.loads(event.get('body', '{}'))
        telegram_id = str(body.get('id', ''))
        first_name = body.get('first_name', '')
        last_name = body.get('last_name', '')
        username = body.get('username', '')
        photo_url = body.get('photo_url', '')
        
        if not telegram_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Telegram ID обязателен'}),
                'isBase64Encoded': False
            }
        
        full_name = f"{first_name} {last_name}".strip() or username or f"User {telegram_id}"
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM users WHERE telegram_id = %s", (telegram_id,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            user_id = existing_user['id']
        else:
            email = f"telegram_{telegram_id}@sparkom.app"
            cursor.execute(
                "INSERT INTO users (email, password_hash, full_name, telegram_id, avatar_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (email, '', full_name, telegram_id, photo_url if photo_url else None)
            )
            user_id = cursor.fetchone()['id']
            
            cursor.execute(
                "INSERT INTO user_providers (user_id, provider, provider_user_id, provider_data) VALUES (%s, %s, %s, %s)",
                (user_id, 'telegram', telegram_id, json.dumps({'username': username, 'first_name': first_name, 'last_name': last_name}))
            )
            conn.commit()
        
        token = generate_token()
        expires_at = datetime.now() + timedelta(days=30)
        
        cursor.execute(
            "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, token, expires_at)
        )
        conn.commit()
        
        cursor.execute("SELECT id, email, full_name FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Вход через Telegram успешен',
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'full_name': user['full_name']
                }
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка Telegram авторизации: {str(e)}'}),
            'isBase64Encoded': False
        }