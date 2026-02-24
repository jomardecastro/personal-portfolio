-- CreateTable
CREATE TABLE "mlm_slots" (
    "id" TEXT NOT NULL,
    "slot_code" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "sponsor_id" TEXT,
    "placement_id" TEXT,
    "position" TEXT,
    "wallet_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_earned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" TEXT NOT NULL DEFAULT 'Starter',
    "membership" TEXT NOT NULL DEFAULT 'Basic',
    "personal_count" INTEGER NOT NULL DEFAULT 0,
    "group_count" INTEGER NOT NULL DEFAULT 0,
    "personal_pv" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "group_pv" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "binary_points_left" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "binary_points_right" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mlm_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mlm_slots_slot_code_key" ON "mlm_slots"("slot_code");

-- AddForeignKey
ALTER TABLE "mlm_slots" ADD CONSTRAINT "mlm_slots_sponsor_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "mlm_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mlm_slots" ADD CONSTRAINT "mlm_slots_placement_id_fkey" FOREIGN KEY ("placement_id") REFERENCES "mlm_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
