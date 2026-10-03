-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "brand" (
    "id" UUID NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system" (
    "id" UUID NOT NULL,
    "name" VARCHAR(500) NOT NULL,

    CONSTRAINT "system_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model" (
    "id" UUID NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "btu" INTEGER NOT NULL,
    "is_save_electricity" BOOLEAN NOT NULL,
    "seer" DECIMAL(5,2) NOT NULL,
    "price_install" DECIMAL(12,2) NOT NULL,
    "price_default" DECIMAL(12,2) NOT NULL,
    "install_warranty" INTEGER NOT NULL,
    "compressor_warranty" INTEGER NOT NULL,
    "spare_part_warranty" INTEGER NOT NULL,
    "system_id" UUID NOT NULL,
    "model_code" VARCHAR(500) NOT NULL,
    "images_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,

    CONSTRAINT "model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "model_system_id_idx" ON "model"("system_id");

-- CreateIndex
CREATE INDEX "model_images_id_idx" ON "model"("images_id");

-- CreateIndex
CREATE INDEX "model_brand_id_idx" ON "model"("brand_id");

-- AddForeignKey
ALTER TABLE "model" ADD CONSTRAINT "model_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "system"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model" ADD CONSTRAINT "model_images_id_fkey" FOREIGN KEY ("images_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model" ADD CONSTRAINT "model_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
