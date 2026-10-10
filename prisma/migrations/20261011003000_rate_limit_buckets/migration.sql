CREATE TABLE "rate_limit_buckets" (
    "key" TEXT NOT NULL,
    "window_start" BIGINT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expires_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key", "window_start")
);

CREATE INDEX "rate_limit_buckets_expires_at_idx"
ON "rate_limit_buckets"("expires_at");
