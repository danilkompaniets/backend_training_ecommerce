-- AlterTable
ALTER TABLE `orders` ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED', 'DELIVERING', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
