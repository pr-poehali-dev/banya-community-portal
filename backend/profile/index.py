import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    '''API для управления профилем пользователя, ролями и расширенными профилями'''

    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    user = get_current_user(event)
    if not user:
        return response(401, {'error': 'Необходима авторизация'})

    action = (event.get('queryStringParameters') or {}).get('action', '')

    if method == 'GET':
        if action == 'dashboard':
            return get_dashboard(user)
        elif action == 'profile':
            return get_profile(user)
        elif action == 'roles':
            return get_roles(user)
        elif action == 'master-profile':
            return get_master_profile(user)
        elif action == 'partner-profile':
            return get_partner_profile(user)
        elif action == 'admin-users':
            return get_admin_users(user)

    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        if action == 'profile':
            return update_profile(user, body)
        elif action == 'master-profile':
            return update_master_profile(user, body)
        elif action == 'partner-profile':
            return update_partner_profile(user, body)

    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        if action == 'request-role':
            return request_role(user, body)
        elif action == 'approve-role':
            return approve_role(user, body)

    return response(400, {'error': 'Неизвестное действие'})


def get_db():
    return psycopg2.connect(
        os.environ['DATABASE_URL'],
        cursor_factory=RealDictCursor,
        options=f"-c search_path={os.environ['MAIN_DB_SCHEMA']}"
    )


def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body, default=str),
        'isBase64Encoded': False
    }


def get_current_user(event):
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return None

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.email, u.full_name, u.phone, u.avatar_url, u.telegram_id "
        "FROM sessions s JOIN users u ON s.user_id = u.id "
        "WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()
    return dict(user) if user else None


def get_dashboard(user):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT role, is_active, requested_at, approved_at FROM user_roles WHERE user_id = %s",
        (user['id'],)
    )
    roles = [dict(r) for r in cur.fetchall()]

    cur.execute(
        "SELECT bio, city, birth_date, gender, avatar_url, social_telegram, social_instagram, social_vk "
        "FROM user_profiles WHERE user_id = %s",
        (user['id'],)
    )
    profile = cur.fetchone()

    has_master = any(r['role'] == 'master' and r['is_active'] for r in roles)
    has_partner = any(r['role'] == 'partner' and r['is_active'] for r in roles)
    is_admin = any(r['role'] == 'admin' and r['is_active'] for r in roles)

    cur.close()
    conn.close()

    return response(200, {
        'user': {
            'id': user['id'],
            'email': user['email'],
            'full_name': user['full_name'],
            'phone': user['phone'],
            'avatar_url': user['avatar_url'],
            'telegram_id': user['telegram_id']
        },
        'profile': dict(profile) if profile else None,
        'roles': roles,
        'permissions': {
            'is_master': has_master,
            'is_partner': has_partner,
            'is_admin': is_admin
        }
    })


def get_profile(user):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM user_profiles WHERE user_id = %s",
        (user['id'],)
    )
    profile = cur.fetchone()

    if not profile:
        cur.execute("INSERT INTO user_profiles (user_id) VALUES (%s) RETURNING *", (user['id'],))
        profile = cur.fetchone()
        conn.commit()

    cur.close()
    conn.close()
    return response(200, {
        'user': {
            'id': user['id'],
            'email': user['email'],
            'full_name': user['full_name'],
            'phone': user['phone'],
        },
        'profile': dict(profile)
    })


def update_profile(user, body):
    conn = get_db()
    cur = conn.cursor()

    if body.get('full_name'):
        cur.execute("UPDATE users SET full_name = %s, updated_at = NOW() WHERE id = %s",
                     (body['full_name'], user['id']))

    if body.get('phone') is not None:
        cur.execute("UPDATE users SET phone = %s, updated_at = NOW() WHERE id = %s",
                     (body['phone'], user['id']))

    cur.execute("SELECT id FROM user_profiles WHERE user_id = %s", (user['id'],))
    if not cur.fetchone():
        cur.execute("INSERT INTO user_profiles (user_id) VALUES (%s)", (user['id'],))

    allowed = ['bio', 'city', 'birth_date', 'gender', 'social_telegram', 'social_instagram', 'social_vk']
    updates = []
    values = []
    for key in allowed:
        if key in body:
            updates.append(f"{key} = %s")
            values.append(body[key] if body[key] != '' else None)

    if updates:
        updates.append("updated_at = NOW()")
        values.append(user['id'])
        cur.execute(
            f"UPDATE user_profiles SET {', '.join(updates)} WHERE user_id = %s",
            values
        )

    conn.commit()
    cur.close()
    conn.close()

    return response(200, {'message': 'Профиль обновлён'})


def get_roles(user):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT role, is_active, requested_at, approved_at FROM user_roles WHERE user_id = %s",
        (user['id'],)
    )
    roles = [dict(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return response(200, {'roles': roles})


def request_role(user, body):
    role = body.get('role')
    if role not in ('master', 'partner'):
        return response(400, {'error': 'Можно запросить роль мастера или партнёра'})

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT id FROM user_roles WHERE user_id = %s AND role = %s",
        (user['id'], role)
    )
    if cur.fetchone():
        cur.close()
        conn.close()
        return response(409, {'error': 'Роль уже запрошена или активна'})

    cur.execute(
        "INSERT INTO user_roles (user_id, role, is_active) VALUES (%s, %s, false)",
        (user['id'], role)
    )
    conn.commit()
    cur.close()
    conn.close()
    return response(200, {'message': f'Запрос на роль "{role}" отправлен'})


def get_master_profile(user):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT role FROM user_roles WHERE user_id = %s AND role = 'master' AND is_active = true",
        (user['id'],)
    )
    if not cur.fetchone():
        cur.close()
        conn.close()
        return response(403, {'error': 'Нет доступа к профилю мастера'})

    cur.execute("SELECT * FROM master_profiles WHERE user_id = %s", (user['id'],))
    profile = cur.fetchone()

    if not profile:
        cur.execute("INSERT INTO master_profiles (user_id) VALUES (%s) RETURNING *", (user['id'],))
        profile = cur.fetchone()
        conn.commit()

    cur.close()
    conn.close()
    return response(200, {'master_profile': dict(profile)})


def update_master_profile(user, body):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT role FROM user_roles WHERE user_id = %s AND role = 'master' AND is_active = true",
        (user['id'],)
    )
    if not cur.fetchone():
        cur.close()
        conn.close()
        return response(403, {'error': 'Нет доступа'})

    cur.execute("SELECT id FROM master_profiles WHERE user_id = %s", (user['id'],))
    if not cur.fetchone():
        cur.execute("INSERT INTO master_profiles (user_id) VALUES (%s)", (user['id'],))

    allowed = ['specialization', 'experience_years', 'description', 'services', 'price_range', 'certificates']
    updates = []
    values = []
    for key in allowed:
        if key in body:
            updates.append(f"{key} = %s")
            values.append(body[key] if body[key] != '' else None)

    if updates:
        updates.append("updated_at = NOW()")
        values.append(user['id'])
        cur.execute(
            f"UPDATE master_profiles SET {', '.join(updates)} WHERE user_id = %s",
            values
        )

    conn.commit()
    cur.close()
    conn.close()
    return response(200, {'message': 'Профиль мастера обновлён'})


def get_partner_profile(user):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT role FROM user_roles WHERE user_id = %s AND role = 'partner' AND is_active = true",
        (user['id'],)
    )
    if not cur.fetchone():
        cur.close()
        conn.close()
        return response(403, {'error': 'Нет доступа к профилю партнёра'})

    cur.execute("SELECT * FROM partner_profiles WHERE user_id = %s", (user['id'],))
    profile = cur.fetchone()

    if not profile:
        cur.execute("INSERT INTO partner_profiles (user_id) VALUES (%s) RETURNING *", (user['id'],))
        profile = cur.fetchone()
        conn.commit()

    cur.close()
    conn.close()
    return response(200, {'partner_profile': dict(profile)})


def update_partner_profile(user, body):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT role FROM user_roles WHERE user_id = %s AND role = 'partner' AND is_active = true",
        (user['id'],)
    )
    if not cur.fetchone():
        cur.close()
        conn.close()
        return response(403, {'error': 'Нет доступа'})

    cur.execute("SELECT id FROM partner_profiles WHERE user_id = %s", (user['id'],))
    if not cur.fetchone():
        cur.execute("INSERT INTO partner_profiles (user_id) VALUES (%s)", (user['id'],))

    allowed = ['banya_name', 'banya_address', 'banya_description', 'banya_phone', 'banya_website', 'working_hours', 'amenities', 'price_range']
    updates = []
    values = []
    for key in allowed:
        if key in body:
            updates.append(f"{key} = %s")
            values.append(body[key] if body[key] != '' else None)

    if updates:
        updates.append("updated_at = NOW()")
        values.append(user['id'])
        cur.execute(
            f"UPDATE partner_profiles SET {', '.join(updates)} WHERE user_id = %s",
            values
        )

    conn.commit()
    cur.close()
    conn.close()
    return response(200, {'message': 'Профиль партнёра обновлён'})


def get_admin_users(user):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT role FROM user_roles WHERE user_id = %s AND role = 'admin' AND is_active = true",
        (user['id'],)
    )
    if not cur.fetchone():
        cur.close()
        conn.close()
        return response(403, {'error': 'Нет доступа'})

    cur.execute(
        "SELECT u.id, u.email, u.full_name, u.phone, u.created_at, u.last_login_at, "
        "ARRAY_AGG(DISTINCT ur.role || ':' || ur.is_active::text) as roles "
        "FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id "
        "GROUP BY u.id ORDER BY u.created_at DESC LIMIT 100"
    )
    users = [dict(u) for u in cur.fetchall()]

    cur.execute(
        "SELECT ur.id, ur.user_id, u.full_name, u.email, ur.role, ur.requested_at "
        "FROM user_roles ur JOIN users u ON ur.user_id = u.id "
        "WHERE ur.is_active = false AND ur.approved_at IS NULL "
        "ORDER BY ur.requested_at"
    )
    pending = [dict(r) for r in cur.fetchall()]

    cur.close()
    conn.close()
    return response(200, {'users': users, 'pending_requests': pending})


def approve_role(user, body):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT role FROM user_roles WHERE user_id = %s AND role = 'admin' AND is_active = true",
        (user['id'],)
    )
    if not cur.fetchone():
        cur.close()
        conn.close()
        return response(403, {'error': 'Нет доступа'})

    role_id = body.get('role_id')
    approve = body.get('approve', True)

    if approve:
        cur.execute(
            "UPDATE user_roles SET is_active = true, approved_at = NOW(), approved_by = %s WHERE id = %s",
            (user['id'], role_id)
        )
    else:
        cur.execute(
            "UPDATE user_roles SET approved_at = NOW(), approved_by = %s WHERE id = %s",
            (user['id'], role_id)
        )

    conn.commit()
    cur.close()
    conn.close()
    return response(200, {'message': 'Решение принято'})
