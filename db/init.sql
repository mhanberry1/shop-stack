-- Create users table
CREATE TABLE users (
	stripeCustomerId VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
	userType VARCHAR(255) DEFAULT 'user',
	isVerified BOOLEAN DEFAULT false,
	verificationCode UNSIGNED MEDIUMINT
);

-- Create products table
CREATE TABLE products (
	stripeProductId VARCHAR(255) PRIMARY KEY,
	quantity INT
);
