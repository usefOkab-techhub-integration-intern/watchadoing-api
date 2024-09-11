-- DropForeignKey
ALTER TABLE `WatchOrder` DROP FOREIGN KEY `WatchOrder_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `WatchOrder` DROP FOREIGN KEY `WatchOrder_shipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `WatchOrderLine` DROP FOREIGN KEY `WatchOrderLine_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `WatchOrderLine` DROP FOREIGN KEY `WatchOrderLine_watchId_fkey`;

-- AddForeignKey
ALTER TABLE `WatchOrder` ADD CONSTRAINT `WatchOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WatchOrder` ADD CONSTRAINT `WatchOrder_shipmentId_fkey` FOREIGN KEY (`shipmentId`) REFERENCES `OrderShipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WatchOrderLine` ADD CONSTRAINT `WatchOrderLine_watchId_fkey` FOREIGN KEY (`watchId`) REFERENCES `Watch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WatchOrderLine` ADD CONSTRAINT `WatchOrderLine_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `WatchOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
