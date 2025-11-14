CREATE TABLE payment (
                         id BIGSERIAL PRIMARY KEY,
                         order_id BIGINT NOT NULL UNIQUE,
                         method VARCHAR(50) NOT NULL,
                         amount INTEGER NOT NULL,
                         status VARCHAR(50) NOT NULL,
                         CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);