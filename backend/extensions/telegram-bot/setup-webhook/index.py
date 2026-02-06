"""
Настройка webhook для Telegram бота
"""

import json
import os
import requests


def handler(event: dict, context) -> dict:
    """
    Устанавливает webhook для Telegram бота
    
    GET ?action=setup - установить webhook
    GET ?action=info - информация о текущем webhook
    GET ?action=delete - удалить webhook
    """
    method = event.get('httpMethod', 'GET')
    
    # CORS для OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    action = event.get('queryStringParameters', {}).get('action', 'info')
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    webhook_secret = os.environ.get('TELEGRAM_WEBHOOK_SECRET')
    
    if not bot_token:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN не настроен'})
        }
    
    # URL функции telegram-bot из func2url.json
    webhook_url = 'https://functions.poehali.dev/1dcf997f-a380-46d0-907b-6aaed3597270'
    
    if action == 'setup':
        # Установка webhook
        url = f'https://api.telegram.org/bot{bot_token}/setWebhook'
        params = {
            'url': webhook_url,
            'allowed_updates': ['message'],
            'drop_pending_updates': True
        }
        
        if webhook_secret:
            params['secret_token'] = webhook_secret
        
        response = requests.post(url, json=params)
        result = response.json()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': result.get('ok', False),
                'description': result.get('description', ''),
                'webhook_url': webhook_url
            })
        }
    
    elif action == 'info':
        # Информация о webhook
        url = f'https://api.telegram.org/bot{bot_token}/getWebhookInfo'
        response = requests.get(url)
        result = response.json()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result.get('result', {}))
        }
    
    elif action == 'delete':
        # Удаление webhook
        url = f'https://api.telegram.org/bot{bot_token}/deleteWebhook'
        response = requests.post(url, json={'drop_pending_updates': True})
        result = response.json()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': result.get('ok', False),
                'description': result.get('description', '')
            })
        }
    
    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Неизвестное действие. Используйте: setup, info, delete'})
    }
