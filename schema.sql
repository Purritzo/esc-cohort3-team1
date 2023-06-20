CREATE DATABASE api_test;
USE api_test;
CREATE TABLE registration(
    id integer PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL, 
    lastName VARCHAR(255) NOT NULL, 
    gender VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    number integer NOT NULL
);
INSERT INTO registration(id,firstName, lastName, gender, email,password,number)
VALUES 
(22,'carina','chu','f', 'carinachu22@gmail.com','coolcarina', 92923373);
