-- Create users table
CREATE TABLE Users (
	id VARCHAR(255) PRIMARY KEY, -- stripe customer id
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create products table
CREATE TABLE Products (
	id VARCHAR(255) PRIMARY KEY, -- stripe product id
	quantity INT
);
