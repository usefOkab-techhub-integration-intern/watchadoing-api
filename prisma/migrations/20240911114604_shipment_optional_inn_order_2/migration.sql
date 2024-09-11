-- DropForeignKey
ALTER TABLE `WatchOrder` DROP FOREIGN KEY `WatchOrder_shipmentId_fkey`;

-- AlterTable
ALTER TABLE `WatchOrder` MODIFY `shipmentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `WatchOrder` ADD CONSTRAINT `WatchOrder_shipmentId_fkey` FOREIGN KEY (`shipmentId`) REFERENCES `OrderShipment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
