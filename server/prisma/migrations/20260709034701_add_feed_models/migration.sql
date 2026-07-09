-- CreateTable
CREATE TABLE "UpdatePost" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "adopter_id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "photo_url" TEXT,
    "milestone_label" TEXT NOT NULL DEFAULT 'other',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpdatePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_post_id_user_id_key" ON "Reaction"("post_id", "user_id");

-- AddForeignKey
ALTER TABLE "UpdatePost" ADD CONSTRAINT "UpdatePost_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdatePost" ADD CONSTRAINT "UpdatePost_adopter_id_fkey" FOREIGN KEY ("adopter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdatePost" ADD CONSTRAINT "UpdatePost_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "UpdatePost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "UpdatePost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
