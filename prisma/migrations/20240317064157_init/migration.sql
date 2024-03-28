-- CreateTable
CREATE TABLE "users" (
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100),
    "password" VARCHAR(100) NOT NULL,
    "token" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "CatalogContainer" (
    "id" VARCHAR(100) NOT NULL,
    "user_id" VARCHAR(100) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "custom_code" VARCHAR(20),
    "desc" TEXT,

    CONSTRAINT "CatalogContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogs" (
    "id" VARCHAR(100) NOT NULL,
    "container_id" VARCHAR(100) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "desc" TEXT,
    "imagePath" VARCHAR(100),

    CONSTRAINT "catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CatalogToTag" (
    "A" VARCHAR(100) NOT NULL,
    "B" VARCHAR(100) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogContainer_custom_code_key" ON "CatalogContainer"("custom_code");

-- CreateIndex
CREATE UNIQUE INDEX "_CatalogToTag_AB_unique" ON "_CatalogToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CatalogToTag_B_index" ON "_CatalogToTag"("B");

-- AddForeignKey
ALTER TABLE "CatalogContainer" ADD CONSTRAINT "CatalogContainer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "CatalogContainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CatalogToTag" ADD CONSTRAINT "_CatalogToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "catalogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CatalogToTag" ADD CONSTRAINT "_CatalogToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
