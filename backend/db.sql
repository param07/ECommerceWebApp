CREATE DATABASE ecommerce;  

create table currency(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(50) NOT NULL
);

create table category(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table product (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT NOT NULL REFERENCES category(id),
    currency_id INT NOT NULL REFERENCES currency(id),
    image_absolute_url VARCHAR(500),
    image_relative_url VARCHAR(500),
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table session_details(
    id SERIAL NOT NULL PRIMARY KEY,
    token VARCHAR(500) NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table cart(
    id SERIAL NOT NULL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES session_details(id),
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table cartDetails(
    id SERIAL NOT NULL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES cart(id),
    product_id INT NOT NULL REFERENCES product(id),
    quantity INT NOT NULL DEFAULT 0,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

