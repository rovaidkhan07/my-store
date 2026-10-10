ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "trackingToken" TEXT,
  ADD COLUMN IF NOT EXISTS "trackingTokenCiphertext" TEXT,
  ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
  ADD COLUMN IF NOT EXISTS "idempotencyRequestHash" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "orders_trackingToken_key"
  ON "orders"("trackingToken");

CREATE UNIQUE INDEX IF NOT EXISTS "orders_idempotencyKey_key"
  ON "orders"("idempotencyKey");
