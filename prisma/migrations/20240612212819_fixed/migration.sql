/*
  Warnings:

  - The values [CANCELED] on the enum `order_event_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order_event` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'DELIVERING', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
