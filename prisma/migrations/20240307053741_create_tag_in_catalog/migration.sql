-- CreateTable
CREATE TABLE `tag` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CatalogToTag` (
    `A` VARCHAR(100) NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_CatalogToTag_AB_unique`(`A`, `B`),
    INDEX `_CatalogToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CatalogToTag` ADD CONSTRAINT `_CatalogToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `catalogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CatalogToTag` ADD CONSTRAINT `_CatalogToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
