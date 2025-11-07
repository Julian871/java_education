CREATE TABLE addresses (
                           id BIGSERIAL PRIMARY KEY,
                           street VARCHAR(500) NOT NULL,
                           city VARCHAR(255) NOT NULL,
                           zip VARCHAR(20) NOT NULL,
                           state VARCHAR(100),
                           country VARCHAR(100) NOT NULL,
                           user_id BIGINT NOT NULL,
                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_city ON addresses(city);