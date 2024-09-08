#CREATE schema WatchaDoingDB;

USE WatchaDoingDB;


CREATE TABLE Watch(
	id INT AUTO_INCREMENT PRIMARY KEY,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	model VARCHAR(100) NOT NULL,
	origin VARCHAR(40) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    sn VARCHAR(20) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
	isDeleted BOOLEAN NOT NULL DEFAULT FALSE
);
	
CREATE TABLE Category(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	description VARCHAR(255),
	isDeleted BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE WatchCategoryMap(
	watchId INT NOT NULL,
    categoryId INT NOT NULL,
    PRIMARY KEY (watchId, categoryId),
    FOREIGN KEY (watchId) REFERENCES Watch(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE
);

INSERT INTO Watch (createdAt, updatedAt, model, origin, price, sn, quantity)
VALUES 
  (NOW(), NOW(), 'Rolex Submariner', 'Switzerland', 8500.00, 'SN1234567890', 5),
  (NOW(), NOW(), 'Omega Seamaster', 'Switzerland', 6000.00, 'SN9876543210', 10),
  (NOW(), NOW(), 'Tag Heuer Carrera', 'Switzerland', 4200.00, 'SN4567891230', 8),
  (NOW(), NOW(), 'Casio G-Shock', 'Japan', 150.00, 'SN0987654321', 50),
  (NOW(), NOW(), 'Seiko Prospex', 'Japan', 450.00, 'SN1122334455', 30);

INSERT INTO Category (name, createdAt, updatedAt, description)
VALUES 
  ('Luxury', NOW(), NOW(), 'High-end luxury watches from premium brands'),
  ('Diving', NOW(), NOW(), 'Watches designed for underwater use'),
  ('Chronograph', NOW(), NOW(), 'Watches with chronograph complications'),
  ('Digital', NOW(), NOW(), 'Digital watches with advanced features'),
  ('Automatic', NOW(), NOW(), 'Watches powered by automatic movements');

INSERT INTO WatchCategoryMap (watchId, categoryId)
VALUES
  (1, 1),  -- Rolex Submariner as a Luxury watch
  (1, 2),  -- Rolex Submariner as a Diving watch
  (2, 1),  -- Omega Seamaster as a Luxury watch
  (2, 2),  -- Omega Seamaster as a Diving watch
  (3, 1),  -- Tag Heuer Carrera as a Luxury watch
  (3, 3),  -- Tag Heuer Carrera as a Chronograph watch
  (4, 4),  -- Casio G-Shock as a Digital watch
  (5, 2),  -- Seiko Prospex as a Diving watch
  (5, 5);  -- Seiko Prospex as an Automatic watch
  
DROP TABLE WatchCategoryMap;
DROP TABLE Watch;
DROP TABLE Category;