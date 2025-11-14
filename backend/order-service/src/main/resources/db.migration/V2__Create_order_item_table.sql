CREATE TABLE order_item (
                            id BIGSERIAL PRIMARY KEY,
                            order_id BIGINT NOT NULL,
                            dish_id BIGINT NOT NULL,
                            quantity INTEGER NOT NULL,
                            price INTEGER NOT NULL,
                            CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);