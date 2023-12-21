-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "timestamp" VARCHAR(255) NOT NULL,
    "message" VARCHAR(2047) NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
