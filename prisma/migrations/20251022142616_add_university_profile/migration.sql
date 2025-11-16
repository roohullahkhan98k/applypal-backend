-- CreateTable (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS "public"."university_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "widget_id" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (only if it doesn't exist)
CREATE UNIQUE INDEX IF NOT EXISTS "university_profiles_userId_key" ON "public"."university_profiles"("userId");

-- CreateIndex (only if it doesn't exist)
CREATE UNIQUE INDEX IF NOT EXISTS "university_profiles_widget_id_key" ON "public"."university_profiles"("widget_id");

-- AddForeignKey (only if it doesn't exist)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'university_profiles_userId_fkey'
  ) THEN
    ALTER TABLE "public"."university_profiles" ADD CONSTRAINT "university_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
