-- CreateTable
CREATE TABLE "room_members" (
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "room_members_pkey" PRIMARY KEY ("user_id","room_id")
);
