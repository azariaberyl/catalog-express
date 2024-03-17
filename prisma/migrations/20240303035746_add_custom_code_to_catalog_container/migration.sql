/*
  Warnings:

  - A unique constraint covering the columns `[custom_code]` on the table `CatalogContainer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CatalogContainer` ADD COLUMN `custom_code` VARCHAR(20) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CatalogContainer_custom_code_key` ON `CatalogContainer`(`custom_code`);
