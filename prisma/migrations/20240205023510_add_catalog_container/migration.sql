/*
  Warnings:

  - You are about to drop the column `user_id` on the `catalogs` table. All the data in the column will be lost.
  - Added the required column `container_id` to the `catalogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `catalogs` DROP FOREIGN KEY `catalogs_user_id_fkey`;

-- AlterTable
ALTER TABLE `catalogs` DROP COLUMN `user_id`,
    ADD COLUMN `container_id` VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE `CatalogContainer` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `desc` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CatalogContainer` ADD CONSTRAINT `CatalogContainer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalogs` ADD CONSTRAINT `catalogs_container_id_fkey` FOREIGN KEY (`container_id`) REFERENCES `CatalogContainer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
