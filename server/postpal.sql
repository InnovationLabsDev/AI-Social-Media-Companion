CREATE DATABASE IF NOT EXISTS postpal;
USE postpal;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    picture LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, picture) 
VALUES ('John Doe', 'john@example.com','$2b$10$0KgXeQ2CHW5uxxthxVAyF.oBZShxtlrWKJXOSjAtN5sigUKcqVMD6', LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/background.jpg'));

SHOW VARIABLES LIKE 'secure_file_priv';


