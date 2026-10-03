BEGIN;

CREATE TABLE "images_new" (
    "id" UUID NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "model_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "images_new_pkey" PRIMARY KEY ("id")
);

INSERT INTO "images_new" ("id", "image_url", "model_id", "position")
SELECT "model"."id", "images"."image_url", "model"."id", 0
FROM "model"
JOIN "images" ON "images"."id" = "model"."images_id";

ALTER TABLE "model" DROP CONSTRAINT "model_images_id_fkey";
DROP INDEX "model_images_id_idx";
ALTER TABLE "model" DROP COLUMN "images_id";
DROP TABLE "images";
ALTER TABLE "images_new" RENAME TO "images";
ALTER TABLE "images" RENAME CONSTRAINT "images_new_pkey" TO "images_pkey";
CREATE UNIQUE INDEX "images_model_id_position_key" ON "images"("model_id", "position");
ALTER TABLE "images" ADD CONSTRAINT "images_model_id_fkey"
    FOREIGN KEY ("model_id") REFERENCES "model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
