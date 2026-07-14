-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "currency" VARCHAR(20) NOT NULL DEFAULT 'INR',
ADD COLUMN     "failure_reason" VARCHAR(100),
ADD COLUMN     "provider_order_id" VARCHAR(255);
