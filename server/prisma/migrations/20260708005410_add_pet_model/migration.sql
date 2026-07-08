-- CreateEnum
CREATE TYPE "PetStatus" AS ENUM ('available', 'pending', 'adopted');

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "shelter_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "age" INTEGER,
    "description" TEXT,
    "photo_url" TEXT,
    "status" "PetStatus" NOT NULL DEFAULT 'available',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "Shelter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
