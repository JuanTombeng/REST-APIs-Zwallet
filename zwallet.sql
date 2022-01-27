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
    profile_picture VARCHAR(128) NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'user',
    active TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL);

CREATE TABLE accounts (id VARCHAR(64) NOT NULL PRIMARY KEY,
    id_user VARCHAR(64) NOT NULL, 
    balance INT(10) NOT NULL DEFAULT 0,
    income INT(10) NOT NULL DEFAULT 0,
    outcome INT(10) NOT NULL DEFAULT 0,
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
    status VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (from_user_id) REFERENCES users(id)
    ON DELETE RESTRICT);

SELECT transactions.invoice, transactions.id_sender,transactions.id_receiver, IF(transactions.id_sender = ${idUser}, u1.username, u2.username) as username,  IF(transactions.id_sender = ${idUser}, u1.picURL, u2.picURL) as picURL, transactions.type, transactions.amount, transactions.notes, transactions.created_at FROM transactions INNER JOIN users u1 ON (u1.id = transactions.id_receiver) INNER JOIN users u2 ON (u2.id = transactions.id_sender) WHERE (id_sender=${idUser} OR id_receiver=${idUser}) ORDER BY created_at ${orderQuery} LIMIT ${limitQuery}

SELECT transactions.id, transactions.from_user_id, transactions.to_user_id, IF(transactions.from_user_id='${userId}', 
            user1.first_name, user2.first_name) AS first_name, IF(transactions.from_user_id=${userId} , user1.profile_picture, user2.profile_picture) 
            AS profile_picture, transactions.transaction_type, transactions.amount, transactions.notes, transactions.status, transactions.created_at 
            FROM transactions INNER JOIN users user1 ON (user1.id = transactions.to_user_id) INNER JOIN users user2 ON (user2.id = transactions.from_user_id) 
            WHERE (from_user_id=${userId} OR to_user_id=${userId}) ORDER BY created_at