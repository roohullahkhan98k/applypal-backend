-- CreateTable
CREATE TABLE "public"."ambassador_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT,
    "country_original" TEXT,
    "country_current" TEXT,
    "currently_living_country" TEXT,
    "phone_number" TEXT,
    "dob" TIMESTAMP(3),
    "gender" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "leave_ap_year" INTEGER,
    "previous_school_name" TEXT,
    "currently_university_student" TEXT,
    "current_university_name" TEXT,
    "calendly_link" TEXT,
    "written_content" TEXT,
    "written_details" TEXT,
    "profile_image" TEXT,
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "why_studying_course" TEXT,
    "skills_experience" TEXT,
    "hobbies_interests" TEXT,
    "caring_causes" TEXT,
    "accomplishments_proud_of" TEXT,
    "answer_q1" TEXT,
    "answer_q2" TEXT,
    "answer_q3" TEXT,
    "answer_q4" TEXT,
    "question1" TEXT,
    "question2" TEXT,
    "question3" TEXT,
    "is_registered_ambassador" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ambassador_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."social_links" (
    "id" TEXT NOT NULL,
    "ambassador_id" TEXT NOT NULL,
    "facebook" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "x" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."following" (
    "id" TEXT NOT NULL,
    "ambassador_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ambassador_profiles_userId_key" ON "public"."ambassador_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "social_links_ambassador_id_key" ON "public"."social_links"("ambassador_id");

-- AddForeignKey
ALTER TABLE "public"."ambassador_profiles" ADD CONSTRAINT "ambassador_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."social_links" ADD CONSTRAINT "social_links_ambassador_id_fkey" FOREIGN KEY ("ambassador_id") REFERENCES "public"."ambassador_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."following" ADD CONSTRAINT "following_ambassador_id_fkey" FOREIGN KEY ("ambassador_id") REFERENCES "public"."ambassador_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
