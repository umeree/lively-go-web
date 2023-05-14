-- AddForeignKey
ALTER TABLE `Followings` ADD CONSTRAINT `Followings_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Followers` ADD CONSTRAINT `Followers_followersId_fkey` FOREIGN KEY (`followersId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
