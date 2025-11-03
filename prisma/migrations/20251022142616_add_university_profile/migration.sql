-- CreateTable
CREATE TABLE "public"."university_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "widget_id" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_profiles_userId_key" ON "public"."university_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "university_profiles_widget_id_key" ON "public"."university_profiles"("widget_id");

-- AddForeignKey
ALTER TABLE "public"."university_profiles" ADD CONSTRAINT "university_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
