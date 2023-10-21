ALTER TABLE "public"."users" ADD COLUMN "website" TEXT;
ALTER TABLE "public"."users" ADD COLUMN "bio" TEXT;
ALTER TABLE "public"."pastes" ADD COLUMN "syntax" TEXT NOT NULL DEFAULT 'text';
