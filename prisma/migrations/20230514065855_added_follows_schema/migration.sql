/*
  Warnings:

  - You are about to drop the `followers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `followings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `followers` DROP FOREIGN KEY `Followers_followersId_fkey`;

-- DropForeignKey
ALTER TABLE `followers` DROP FOREIGN KEY `Followers_userId_fkey`;

-- DropForeignKey
ALTER TABLE `followings` DROP FOREIGN KEY `Followings_followingId_fkey`;

-- DropForeignKey
ALTER TABLE `followings` DROP FOREIGN KEY `Followings_userId_fkey`;

-- DropTable
DROP TABLE `followers`;

-- DropTable
DROP TABLE `followings`;

-- CreateTable
CREATE TABLE `Follows` (
    `followerId` INTEGER NOT NULL,
    `followingId` INTEGER NOT NULL,

    PRIMARY KEY (`followerId`, `followingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Follows` ADD CONSTRAINT `Follows_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follows` ADD CONSTRAINT `Follows_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
