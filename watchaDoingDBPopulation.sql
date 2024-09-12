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

INSERT INTO _CategoryToWatch (B, A)
VALUES
  (1, 1),  
  (1, 2),  
  (2, 1),  
  (2, 2),  
  (3, 1),  
  (3, 3),  
  (4, 4),  
  (5, 2),  
  (5, 5);  

INSERT INTO Customer (name, isDeleted) VALUES
('John Doe', FALSE),
('Jane Smith', FALSE),
('Alice Johnson', FALSE),
('Bob Williams', TRUE);

INSERT INTO OrderShipment (trackingNum) VALUES
('TRK1234567890'),
('TRK9876543210'),
('TRK1239874560');

INSERT INTO WatchOrder (customerId, shipmentId) VALUES
(1, 1),    
(2, 2),    
(3, NULL); 

INSERT INTO WatchOrderLine (quantity, watchId, orderId) VALUES
(2, 1, 1),  
(1, 2, 1),  
(3, 3, 2);  