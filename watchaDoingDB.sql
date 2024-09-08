#CREATE schema WatchaDoingDB;

USE WatchaDoingDB;

CREATE TABLE Watch(
	id INT AUTO_INCREMENT PRIMARY KEY,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	model VARCHAR(100) NOT NULL,
	origin VARCHAR(40) NOT NULL,
    price DECIMAL(12, 2) NOT NULL
);
	
CREATE TABLE Category(
	id INT AUTO_INCREMENT PRIMARY KEY,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	description VARCHAR(255) NOT NULL
);


CREATE TABLE WatchCategoryMap(
	watch_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (watch_id, category_id),
    FOREIGN KEY (watch_id) REFERENCES Watch(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE
);

INSERT INTO Watch (created_at, updated_at, model, origin, price) 
VALUES
('2024-09-01 12:00:00', '2024-09-01 12:00:00', 'Rolex Submariner', 'Switzerland', 12500.00),
('2024-09-01 12:30:00', '2024-09-01 12:30:00', 'Omega Seamaster', 'Switzerland', 8500.00),
('2024-09-01 13:00:00', '2024-09-01 13:00:00', 'Tag Heuer Carrera', 'Switzerland', 4500.00),
('2024-09-01 13:30:00', '2024-09-01 13:30:00', 'Casio G-Shock', 'Japan', 150.00);

INSERT INTO Category (created_at, updated_at, description) 
VALUES
('2024-09-01 12:00:00', '2024-09-01 12:00:00', 'Luxury'),
('2024-09-01 12:00:00', '2024-09-01 12:00:00', 'Diving'),
('2024-09-01 12:00:00', '2024-09-01 12:00:00', 'Sports'),
('2024-09-01 12:00:00', '2024-09-01 12:00:00', 'Digital');


INSERT INTO WatchCategoryMap (watch_id, category_id) 
VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 1), 
(3, 3),
(4, 3), 
(4, 4)