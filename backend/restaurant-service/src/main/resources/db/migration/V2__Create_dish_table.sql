CREATE TABLE dish (
                      id BIGSERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      description TEXT,
                      price INTEGER NOT NULL,
                      image_url VARCHAR(500),
                      restaurant_id BIGINT NOT NULL,

                      CONSTRAINT fk_dish_restaurant
                          FOREIGN KEY (restaurant_id)
                              REFERENCES restaurant(id)
);