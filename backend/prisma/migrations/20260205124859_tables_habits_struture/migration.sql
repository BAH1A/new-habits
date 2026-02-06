-- CreateTable
CREATE TABLE "habit_week_days" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "habit_id" INTEGER NOT NULL,
    "week_day" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "days" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dayhabits" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day_id" INTEGER NOT NULL,
    "habit_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_week_days_habit_id_week_day_key" ON "habit_week_days"("habit_id", "week_day");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "dayhabits_day_id_habit_id_key" ON "dayhabits"("day_id", "habit_id");
