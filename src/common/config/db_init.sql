-- -- DROP EVERYTHING
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS seats CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- -- CREATE USERS (exact original column names)
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255),
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     is_verified BOOLEAN DEFAULT FALSE,
--     verification_token VARCHAR(255),
--     refresh_token VARCHAR(255),
--     reset_password_token VARCHAR(255),
--     reset_password_expires TIMESTAMP,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- CREATE SEATS (exact original column names)
-- CREATE TABLE seats (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     isbooked BOOLEAN DEFAULT FALSE,
--     user_id INTEGER DEFAULT NULL,
--     CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- -- ADD INDEXES (performance only, no schema change)
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_verification_token ON users(verification_token);
-- CREATE INDEX idx_seats_user_id ON seats(user_id);
-- CREATE INDEX idx_seats_isbooked ON seats(isbooked);

-- INSERT INTO seats (name, isbooked, user_id) VALUES
-- ('A1', FALSE, NULL), ('A2', FALSE, NULL), ('A3', FALSE, NULL), ('A4', FALSE, NULL),
-- ('A5', FALSE, NULL), ('A6', FALSE, NULL), ('A7', FALSE, NULL), ('A8', FALSE, NULL),
-- ('A9', FALSE, NULL), ('A10', FALSE, NULL), ('B1', FALSE, NULL), ('B2', FALSE, NULL),
-- ('B3', FALSE, NULL), ('B4', FALSE, NULL), ('B5', FALSE, NULL), ('B6', FALSE, NULL),
-- ('B7', FALSE, NULL), ('B8', FALSE, NULL), ('B9', FALSE, NULL), ('B10', FALSE, NULL),
-- ('C1', FALSE, NULL), ('C2', FALSE, NULL), ('C3', FALSE, NULL), ('C4', FALSE, NULL),
-- ('C5', FALSE, NULL), ('C6', FALSE, NULL), ('C7', FALSE, NULL), ('C8', FALSE, NULL),
-- ('C9', FALSE, NULL), ('C10', FALSE, NULL), ('D1', FALSE, NULL), ('D2', FALSE, NULL),
-- ('D3', FALSE, NULL), ('D4', FALSE, NULL), ('D5', FALSE, NULL), ('D6', FALSE, NULL),
-- ('D7', FALSE, NULL), ('D8', FALSE, NULL), ('D9', FALSE, NULL), ('D10', FALSE, NULL);

-- ALTER TABLE users 
-- ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- DROP TRIGGER IF EXISTS update_users_updated_at ON users;
-- CREATE TRIGGER update_users_updated_at
--     BEFORE UPDATE ON users
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();
