import { MigrationInterface, QueryRunner } from 'typeorm';

export class MergeSurveyMediaTables1597997348694 implements MigrationInterface {
  name = 'MergeSurveyMediaTables1597997348694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE survey_image`);
    await queryRunner.query(`DROP TABLE survey_video`);
    await queryRunner.query(
      `
      CREATE TYPE "survey_media_observations_enum" AS
      ENUM(
        'healthy', 'possible-disease', 'evident-disease', 'mortality', 'environmental', 'anthropogenic'
      )
      `,
    );
    await queryRunner.query(
      `CREATE TYPE "survey_media_type_enum" AS ENUM('video', 'image')`,
    );
    await queryRunner.query(
      `
      CREATE TABLE "survey_media" (
        "id" SERIAL NOT NULL,
        "url" character varying NOT NULL,
        "quality" integer NOT NULL DEFAULT 1,
        "featured" boolean NOT NULL,
        "hidden" boolean NOT NULL,
        "metadata" json NOT NULL,
        "observations" "survey_media_observations_enum" NOT NULL,
        "comments" character varying NOT NULL,
        "type" "survey_media_type_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "survey_id" integer,
        "poi_id" integer,
        CONSTRAINT "PK_ad17eeda5ccb03a0a425b2a341f" PRIMARY KEY ("id")
      )
      `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "survey_media"
      ADD CONSTRAINT "FK_aafa12b43ef0778849bbb6baf7a"
      FOREIGN KEY ("survey_id")
      REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "survey_media"
      ADD CONSTRAINT "FK_cdb564bc26282caa4e81306cc92"
      FOREIGN KEY ("poi_id")
      REFERENCES "reef_point_of_interest"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_media" DROP CONSTRAINT "FK_cdb564bc26282caa4e81306cc92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_media" DROP CONSTRAINT "FK_aafa12b43ef0778849bbb6baf7a"`,
    );
    await queryRunner.query(`DROP TABLE "survey_media"`);
    await queryRunner.query(`DROP TYPE "survey_media_observations_enum"`);
    await queryRunner.query(`DROP TYPE "survey_media_type_enum"`);
    await queryRunner.query(
      `
      CREATE TABLE "survey_image" (
        "id" SERIAL NOT NULL,
        "location" point NOT NULL,
        "url" character varying NOT NULL,
        "timestamp" TIMESTAMP NOT NULL,
        "upload_timestamp" TIMESTAMP NOT NULL,
        "quality" integer NOT NULL DEFAULT 1,
        "featured" boolean NOT NULL,
        "hidden" boolean NOT NULL,
        "metadata" json NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "survey_id" integer,
        "user_id" integer,
        "poi_id" integer,
        CONSTRAINT "PK_db7ef3d7fbf745cd37e5133a862" PRIMARY KEY ("id")
      )
      `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9229452ed71aae8c51844ce86e" ON "survey_image" USING GiST ("location") `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "survey_image"
      ADD CONSTRAINT "FK_33661b808acca8e6d580024fecc"
      FOREIGN KEY ("survey_id")
      REFERENCES "survey"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "survey_image"
      ADD CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "survey_image"
      ADD CONSTRAINT "FK_9eedca1fe98841a659c79346170"
      FOREIGN KEY ("poi_id")
      REFERENCES "reef_point_of_interest"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `
      CREATE TABLE "survey_video" (
        "id" SERIAL NOT NULL,
        "location" point NOT NULL,
        "url" character varying NOT NULL,
        "start_timestamp" TIMESTAMP NOT NULL,
        "end_timestamp" TIMESTAMP NOT NULL,
        "upload_timestamp" TIMESTAMP NOT NULL,
        "quality" integer NOT NULL DEFAULT 1,
        "important" boolean NOT NULL,
        "hidden" boolean NOT NULL,
        "metadata" json NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "survey_id" integer,
        "user_id" integer,
        "poi_id" integer,
        CONSTRAINT "PK_9272f4b8dbe71d5f65d56c22c7a" PRIMARY KEY ("id")
      )
      `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_332a5f87cb3709f88980816dab" ON "survey_video" USING GiST ("location") `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "survey_video"
      ADD CONSTRAINT "FK_40c2aa6ff00db8432a70239de7f"
      FOREIGN KEY ("survey_id")
      REFERENCES "survey"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "survey_video"
      ADD CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "survey_video"
      ADD CONSTRAINT "FK_64d6c8c1f3a073e3bc2512cbae2"
      FOREIGN KEY ("poi_id")
      REFERENCES "reef_point_of_interest"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
  }
}
