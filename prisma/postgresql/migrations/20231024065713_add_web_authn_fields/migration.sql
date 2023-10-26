ALTER TABLE "users" ADD COLUMN "extra_fields" JSONB NOT NULL DEFAULT '{}'::jsonb;

-- CreateTable
CREATE TABLE "authenticators" (
    "id" BIGSERIAL NOT NULL,
    "credential_id" TEXT NOT NULL,
    "credential_public_key" BYTEA NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "credential_device_type" TEXT NOT NULL,
    "credential_backed_up" BOOLEAN NOT NULL,
    "transports" TEXT,
    "fmt" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authenticators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credential_id" ON "authenticators"("credential_id");

-- CreateIndex
CREATE INDEX "user_id" ON "authenticators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "authenticators_id_key" ON "authenticators"("id");

-- AddForeignKey
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
