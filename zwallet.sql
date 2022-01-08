CREATE DATABASE zwallet_app;

USE DATABASE zwallet_app;

CREATE TABLE users (id VARCHAR(64) NOT NULL PRIMARY KEY, 
    username VARCHAR(50) NOT NULL, 
    email VARCHAR(50) NOT NULL, 
    password VARCHAR(100) NOT NULL,
    pin INT(6) NOT NULL, 
    first_name VARCHAR(50) NOT NULL, 
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    profile_picture BLOB NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL);

CREATE TABLE accounts (id VARCHAR(64) NOT NULL PRIMARY KEY,
    id_user VARCHAR(64) NOT NULL, 
    balance INT(10) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (id_user) REFERENCES users(id)
    ON DELETE CASCADE);

CREATE TABLE transactions (id VARCHAR(64) NOT NULL PRIMARY KEY, 
    from_user_id VARCHAR(64) NOT NULL, 
    to_user_id VARCHAR(64) NOT NULL,
    amount INT(10) NOT NULL DEFAULT 0, 
    transaction_type VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    status TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (from_user_id) REFERENCES users(id)
    ON DELETE RESTRICT);

-- CREATE TABLE transaction_details (id VARCHAR(64) NOT NULL PRIMARY KEY)


-- SELECT accounts.id, accounts.id_user, users.username, accounts.account_number, contact_holder.id_user_holder 
--     FROM accounts INNER JOIN users ON accounts.id_user = users.id 
--     INNER JOIN contact_holder ON accounts.id_user = contact_holder.id_user_holder;


-- search user with name
-- SELECT users.id, accounts.id AS id_accounts, users.email, profiles.first_name, profiles.last_name 
--     FROM users INNER JOIN profiles ON users.id = profiles.id_user 
--     INNER JOIN accounts ON users.id = accounts.id_user WHERE profiles.first_name LIKE '%ua%';

-- sort transactions by created_at
-- SELECT users.username, transactions.from_account_id, transactions.to_account_id, transactions.amount, transactions.created_at 
--     FROM users INNER JOIN accounts ON users.id = accounts.id_user 
--     INNER JOIN transactions ON accounts.id = transactions.from_account_id 
--     ORDER BY created_at DESC;