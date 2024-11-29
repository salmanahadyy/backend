/*
  Warnings:

  - The values [health] on the enum `BlogCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BlogCategory_new" AS ENUM ('sport', 'sains', 'food', 'tech');
ALTER TABLE "Blog" ALTER COLUMN "category" TYPE "BlogCategory_new" USING ("category"::text::"BlogCategory_new");
ALTER TYPE "BlogCategory" RENAME TO "BlogCategory_old";
ALTER TYPE "BlogCategory_new" RENAME TO "BlogCategory";
DROP TYPE "BlogCategory_old";
COMMIT;
