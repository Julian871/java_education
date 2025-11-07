CREATE TABLE restaurant (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            cuisine VARCHAR(255) NOT NULL,
                            address VARCHAR(500) NOT NULL
);