-- CreateTable
CREATE TABLE `users` (
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `token` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;

-- CreateTable
CREATE TABLE `catalogs` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `desc` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `catalogs` ADD CONSTRAINT `catalogs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
