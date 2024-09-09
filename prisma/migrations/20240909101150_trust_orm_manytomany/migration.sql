/*
  Warnings:

  - You are about to drop the `WatchCategoryMap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WatchCategoryMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `WatchCategoryMap` DROP FOREIGN KEY `WatchCategoryMap_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `WatchCategoryMap` DROP FOREIGN KEY `WatchCategoryMap_watchId_fkey`;

-- DropForeignKey
ALTER TABLE `_WatchCategoryMap` DROP FOREIGN KEY `_WatchCategoryMap_A_fkey`;

-- DropForeignKey
ALTER TABLE `_WatchCategoryMap` DROP FOREIGN KEY `_WatchCategoryMap_B_fkey`;

-- DropTable
DROP TABLE `WatchCategoryMap`;

-- DropTable
DROP TABLE `_WatchCategoryMap`;

-- CreateTable
CREATE TABLE `_CategoryToWatch` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryToWatch_AB_unique`(`A`, `B`),
    INDEX `_CategoryToWatch_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CategoryToWatch` ADD CONSTRAINT `_CategoryToWatch_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToWatch` ADD CONSTRAINT `_CategoryToWatch_B_fkey` FOREIGN KEY (`B`) REFERENCES `Watch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
