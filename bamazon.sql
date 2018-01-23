DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name varchar(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity integer null,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(100) NULL,
over_head_costs decimal(10,2) NULL,
PRIMARY KEY (department_id)
);

INSERT INTO 
products 
(product_name, department_name, price, stock_quantity) 
VALUES 
('mock', 'mock',110,1),
('iphone', 'electronics',150,50),
('nzxt', 'computer parts', 29, 10),
('succullent plants', 'plants', 11, 2),
('kitchen sink strainer', 'kitchen', 7.42, 3),
('fire tv stick', 'electronics', 29.99, 15),
('oil diffuser humidifier', 'home', 18.95, 21),
('digital body weight bathroom scale', 'home', 16.80, 12),
('men daily multivitamin supplement', 'health supplement', 9.75, 20),
('sony bluetooth speaker', 'electronics', 12.99, 5),
('digital body weight bathroom scale', 'home', 16.80, 1),
('TNSO USB Type-C Cable', 'home', 12.49, 15);

INSERT INTO 
departments
(department_name, over_head_costs) VALUES 
('mock' ,0.50),
('electronics' ,0.50),
('computer parts' ,0.50),
('plants' ,0.50),
('kitchen' ,0.50),
('health supplement' ,0.50),
('home' ,0.50)