-- CreateTable
CREATE TABLE "public"."university_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "widget_id" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "widget_config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_clicks" (
    "id" TEXT NOT NULL,
    "widget_id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "country" TEXT,
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_profiles_userId_key" ON "public"."university_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "university_profiles_widget_id_key" ON "public"."university_profiles"("widget_id");

-- CreateIndex
CREATE INDEX "chat_clicks_widget_id_idx" ON "public"."chat_clicks"("widget_id");

-- CreateIndex
CREATE INDEX "chat_clicks_domain_idx" ON "public"."chat_clicks"("domain");

-- CreateIndex
CREATE INDEX "chat_clicks_country_idx" ON "public"."chat_clicks"("country");

-- CreateIndex
CREATE INDEX "chat_clicks_clicked_at_idx" ON "public"."chat_clicks"("clicked_at");

-- AddForeignKey
ALTER TABLE "public"."university_profiles" ADD CONSTRAINT "university_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
