-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Coffee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "roaster" TEXT,
    "origin" TEXT,
    "variety" TEXT,
    "brewMethod" TEXT,
    "grindSize" TEXT,
    "waterTemp" INTEGER,
    "doseGrams" REAL,
    "yieldMl" REAL,
    "brewTimeSeconds" INTEGER,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "aroma" INTEGER,
    "acidity" INTEGER,
    "body" INTEGER,
    "sweetness" INTEGER,
    "bitterness" INTEGER,
    "flavorNotes" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Coffee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CoffeeToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CoffeeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Coffee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CoffeeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Coffee_userId_idx" ON "Coffee"("userId");

-- CreateIndex
CREATE INDEX "Coffee_createdAt_idx" ON "Coffee"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CoffeeToTag_AB_unique" ON "_CoffeeToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CoffeeToTag_B_index" ON "_CoffeeToTag"("B");
