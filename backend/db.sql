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

create table orders(
    id SERIAL NOT NULL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES session_details(id),
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    order_pay_status VARCHAR(50) NOT NULL,
    order_deliver_status VARCHAR(50) NOT NULL,
    shipping_address TEXT DEFAULT NULL,
    billing_address TEXT DEFAULT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table order_details(
    id SERIAL NOT NULL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id),
    product_id INT NOT NULL REFERENCES product(id),
    quantity INT NOT NULL DEFAULT 0,
    order_deliver_status VARCHAR(50) NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table payment_details(
    id SERIAL NOT NULL PRIMARY KEY,
    ord_id INT NOT NULL REFERENCES orders(id),
    session_id INT NOT NULL REFERENCES session_details(id),
    transaction_id VARCHAR(100) NOT NULL,
    payment_status VARCHAR(255) NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);



