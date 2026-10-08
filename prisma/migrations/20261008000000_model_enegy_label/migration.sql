ALTER TABLE "model"
    ADD COLUMN "enegy_label" INTEGER NOT NULL DEFAULT 0,
    ADD CONSTRAINT "model_enegy_label_range"
        CHECK ("enegy_label" BETWEEN 0 AND 5);
