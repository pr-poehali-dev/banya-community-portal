
CREATE TYPE user_role AS ENUM ('guest', 'participant', 'master', 'partner', 'admin');

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role user_role NOT NULL DEFAULT 'participant',
    is_active BOOLEAN NOT NULL DEFAULT true,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(id),
    UNIQUE(user_id, role)
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    bio TEXT,
    city VARCHAR(100),
    birth_date DATE,
    gender VARCHAR(20),
    avatar_url TEXT,
    social_telegram VARCHAR(255),
    social_instagram VARCHAR(255),
    social_vk VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE master_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    specialization TEXT,
    experience_years INTEGER,
    description TEXT,
    services TEXT,
    price_range VARCHAR(100),
    certificates TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partner_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    banya_name VARCHAR(255),
    banya_address TEXT,
    banya_description TEXT,
    banya_phone VARCHAR(50),
    banya_website VARCHAR(255),
    working_hours TEXT,
    amenities TEXT,
    price_range VARCHAR(100),
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user_roles (user_id, role, is_active, approved_at) 
SELECT id, 'participant', true, CURRENT_TIMESTAMP FROM users;

INSERT INTO user_profiles (user_id) SELECT id FROM users;
