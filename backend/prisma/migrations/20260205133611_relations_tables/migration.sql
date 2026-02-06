-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dayhabits" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day_id" INTEGER NOT NULL,
    "habit_id" INTEGER NOT NULL,
    CONSTRAINT "dayhabits_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "dayhabits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dayhabits" ("day_id", "habit_id", "id") SELECT "day_id", "habit_id", "id" FROM "dayhabits";
DROP TABLE "dayhabits";
ALTER TABLE "new_dayhabits" RENAME TO "dayhabits";
CREATE UNIQUE INDEX "dayhabits_day_id_habit_id_key" ON "dayhabits"("day_id", "habit_id");
CREATE TABLE "new_habit_week_days" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "habit_id" INTEGER NOT NULL,
    "week_day" INTEGER NOT NULL,
    CONSTRAINT "habit_week_days_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habit_week_days" ("habit_id", "id", "week_day") SELECT "habit_id", "id", "week_day" FROM "habit_week_days";
DROP TABLE "habit_week_days";
ALTER TABLE "new_habit_week_days" RENAME TO "habit_week_days";
CREATE UNIQUE INDEX "habit_week_days_habit_id_week_day_key" ON "habit_week_days"("habit_id", "week_day");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
