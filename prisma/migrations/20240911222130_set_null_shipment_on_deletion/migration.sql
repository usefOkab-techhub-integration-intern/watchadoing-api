-- DropForeignKey
ALTER TABLE `WatchOrder` DROP FOREIGN KEY `WatchOrder_shipmentId_fkey`;

-- AddForeignKey
ALTER TABLE `WatchOrder` ADD CONSTRAINT `WatchOrder_shipmentId_fkey` FOREIGN KEY (`shipmentId`) REFERENCES `OrderShipment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
