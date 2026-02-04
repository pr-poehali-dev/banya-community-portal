CREATE TABLE IF NOT EXISTS user_providers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    provider_data JSONB,
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id),
    UNIQUE(user_id, provider)
);

CREATE INDEX idx_user_providers_user_id ON user_providers(user_id);
CREATE INDEX idx_user_providers_provider ON user_providers(provider, provider_user_id);

COMMENT ON TABLE user_providers IS 'Связь пользователей с различными провайдерами авторизации';
COMMENT ON COLUMN user_providers.provider IS 'Тип провайдера: telegram, google, vk, yandex, email';
COMMENT ON COLUMN user_providers.provider_user_id IS 'ID пользователя в системе провайдера';
COMMENT ON COLUMN user_providers.provider_data IS 'Дополнительные данные от провайдера (JSON)';