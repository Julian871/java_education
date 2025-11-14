CREATE TABLE orders (
                        id BIGSERIAL PRIMARY KEY,
                        status VARCHAR(50) NOT NULL,
                        order_date TIMESTAMP NOT NULL,
                        user_id INTEGER NOT NULL,
                        restaurant_id INTEGER NOT NULL,
                        total_price INTEGER NOT NULL
);