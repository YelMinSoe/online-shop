-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SENT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentSlip" VARCHAR(255),
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
