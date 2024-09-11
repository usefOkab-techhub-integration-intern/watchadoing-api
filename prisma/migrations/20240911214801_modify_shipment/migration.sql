-- AlterTable
ALTER TABLE `OrderShipment` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `trackingNum` VARCHAR(191) NOT NULL;
