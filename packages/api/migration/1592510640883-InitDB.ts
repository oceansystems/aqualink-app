import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDB1592510640883 implements MigrationInterface {
    name = 'InitDB1592510640883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);
        await queryRunner.query(`CREATE TABLE "region" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "polygon" polygon NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "parent_id" integer, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_46b146ce5d6ee2de43d8448562" ON "region" USING GiST ("polygon") `);
        await queryRunner.query(`CREATE TYPE "user_admin_level_enum" AS ENUM('default', 'reef_manager', 'super_admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firebase_uid" character varying(128) NOT NULL, "full_name" character varying(50) NOT NULL, "email" character varying(254) NOT NULL, "location" point, "country" character varying(50), "admin_level" "user_admin_level_enum" NOT NULL DEFAULT 'default', "description" character varying, "image_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_af7cabf8e064aa7bad09c731ba" ON "user" USING GiST ("location") `);
        await queryRunner.query(`CREATE TABLE "video_stream" ("id" SERIAL NOT NULL, "owner_email" character varying(254) NOT NULL, "location" point NOT NULL, "url" character varying NOT NULL, "quality" integer NOT NULL DEFAULT 1, "important" boolean NOT NULL, "hidden" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c8a8fee15d627cfb3b4db140d5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_de4eb243bae87587f9ca56ba8d" ON "video_stream" USING GiST ("location") `);
        await queryRunner.query(`CREATE TABLE "reef" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "polygon" polygon NOT NULL, "temperature_threshold" double precision NOT NULL, "depth" integer NOT NULL, "status" character varying NOT NULL, "video_stream" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "region_id" integer, "admin_id" integer, "stream_id" integer, CONSTRAINT "PK_ae886b4d9d8877affc5567dd4bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4dd2eeb5079abc8e070e991528" ON "reef" USING GiST ("polygon") `);
        await queryRunner.query(`CREATE TABLE "reef_point_of_interest" ("id" SERIAL NOT NULL, "poi_label_id" integer NOT NULL, "image_url" character varying NOT NULL, "name" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reef_id" integer, CONSTRAINT "PK_7b0b1dcf07cfda0805811188d84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "daily_data" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "min_bottom_temperature" double precision NOT NULL, "max_bottom_temperature" double precision NOT NULL, "avg_bottom_temperature" double precision NOT NULL, "degree_heating_days" double precision NOT NULL, "surface_temperature" double precision NOT NULL, "satellite_temperature" double precision NOT NULL, "min_wave_speed" double precision NOT NULL, "max_wave_speed" double precision NOT NULL, "avg_wave_speed" double precision NOT NULL, "wave_direction" integer NOT NULL, "wave_period" integer NOT NULL, "min_wind_speed" double precision NOT NULL, "max_wind_speed" double precision NOT NULL, "avg_wind_speed" double precision NOT NULL, "wind_direction" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reef_id" integer, CONSTRAINT "PK_75d80e4c2ed6e1aefb4892ba583" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monthly_temperature_threshold" ("id" SERIAL NOT NULL, "month" integer NOT NULL, "temperature_threshold" integer NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reef_id" integer, "user_update" integer, CONSTRAINT "PK_aaca6d5034779698825fefd47d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spotter" ("id" SERIAL NOT NULL, "sofar_name" character varying(50) NOT NULL, "location" point NOT NULL, "hardware_version" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reef_id" integer, CONSTRAINT "PK_d096178b8cb4371cf6c4e5f993d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_662dee9e9b7a5eb55be723a1da" ON "spotter" ("sofar_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd07cbd734fb8d7d6417a8c936" ON "spotter" USING GiST ("location") `);
        await queryRunner.query(`CREATE TABLE "survey" ("id" SERIAL NOT NULL, "temperature" double precision NOT NULL, "observations" text NOT NULL, "dive_date" TIMESTAMP NOT NULL, "upload_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "reef_id" integer, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey_image" ("id" SERIAL NOT NULL, "location" point NOT NULL, "url" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "upload_timestamp" TIMESTAMP NOT NULL, "quality" integer NOT NULL DEFAULT 1, "featured" boolean NOT NULL, "hidden" boolean NOT NULL, "metadata" json NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "survey_id" integer, "user_id" integer, "poi_id" integer, CONSTRAINT "PK_db7ef3d7fbf745cd37e5133a862" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9229452ed71aae8c51844ce86e" ON "survey_image" USING GiST ("location") `);
        await queryRunner.query(`CREATE TABLE "survey_video" ("id" SERIAL NOT NULL, "location" point NOT NULL, "url" character varying NOT NULL, "start_timestamp" TIMESTAMP NOT NULL, "end_timestamp" TIMESTAMP NOT NULL, "upload_timestamp" TIMESTAMP NOT NULL, "quality" integer NOT NULL DEFAULT 1, "important" boolean NOT NULL, "hidden" boolean NOT NULL, "metadata" json NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "survey_id" integer, "user_id" integer, "poi_id" integer, CONSTRAINT "PK_9272f4b8dbe71d5f65d56c22c7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_332a5f87cb3709f88980816dab" ON "survey_video" USING GiST ("location") `);
        await queryRunner.query(`ALTER TABLE "region" ADD CONSTRAINT "FK_2547f55866c0274d35fdd9a29c0" FOREIGN KEY ("parent_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef" ADD CONSTRAINT "FK_073078b9b04d1501c3c373fe1b8" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef" ADD CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef" ADD CONSTRAINT "FK_63c63e16bcebffa7ab94aaddbdb" FOREIGN KEY ("stream_id") REFERENCES "video_stream"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef_point_of_interest" ADD CONSTRAINT "FK_4a2bdb6a3cff9c746be703224dc" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_data" ADD CONSTRAINT "FK_281bc33ffb88dab13d8112d22e1" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" ADD CONSTRAINT "FK_d69b2e6aaf16f588be54301915a" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" ADD CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d" FOREIGN KEY ("user_update") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spotter" ADD CONSTRAINT "FK_29055018df0d986236e70f1d7f0" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_a37da0d039df5145bd187a32e09" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_ac7705ae80042c05f5582938c8a" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_image" ADD CONSTRAINT "FK_33661b808acca8e6d580024fecc" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_image" ADD CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_image" ADD CONSTRAINT "FK_9eedca1fe98841a659c79346170" FOREIGN KEY ("poi_id") REFERENCES "reef_point_of_interest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_video" ADD CONSTRAINT "FK_40c2aa6ff00db8432a70239de7f" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_video" ADD CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_video" ADD CONSTRAINT "FK_64d6c8c1f3a073e3bc2512cbae2" FOREIGN KEY ("poi_id") REFERENCES "reef_point_of_interest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_video" DROP CONSTRAINT "FK_64d6c8c1f3a073e3bc2512cbae2"`);
        await queryRunner.query(`ALTER TABLE "survey_video" DROP CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e"`);
        await queryRunner.query(`ALTER TABLE "survey_video" DROP CONSTRAINT "FK_40c2aa6ff00db8432a70239de7f"`);
        await queryRunner.query(`ALTER TABLE "survey_image" DROP CONSTRAINT "FK_9eedca1fe98841a659c79346170"`);
        await queryRunner.query(`ALTER TABLE "survey_image" DROP CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7"`);
        await queryRunner.query(`ALTER TABLE "survey_image" DROP CONSTRAINT "FK_33661b808acca8e6d580024fecc"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_ac7705ae80042c05f5582938c8a"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_a37da0d039df5145bd187a32e09"`);
        await queryRunner.query(`ALTER TABLE "spotter" DROP CONSTRAINT "FK_29055018df0d986236e70f1d7f0"`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" DROP CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d"`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" DROP CONSTRAINT "FK_d69b2e6aaf16f588be54301915a"`);
        await queryRunner.query(`ALTER TABLE "daily_data" DROP CONSTRAINT "FK_281bc33ffb88dab13d8112d22e1"`);
        await queryRunner.query(`ALTER TABLE "reef_point_of_interest" DROP CONSTRAINT "FK_4a2bdb6a3cff9c746be703224dc"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP CONSTRAINT "FK_63c63e16bcebffa7ab94aaddbdb"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP CONSTRAINT "FK_073078b9b04d1501c3c373fe1b8"`);
        await queryRunner.query(`ALTER TABLE "region" DROP CONSTRAINT "FK_2547f55866c0274d35fdd9a29c0"`);
        await queryRunner.query(`DROP INDEX "IDX_332a5f87cb3709f88980816dab"`);
        await queryRunner.query(`DROP TABLE "survey_video"`);
        await queryRunner.query(`DROP INDEX "IDX_9229452ed71aae8c51844ce86e"`);
        await queryRunner.query(`DROP TABLE "survey_image"`);
        await queryRunner.query(`DROP TABLE "survey"`);
        await queryRunner.query(`DROP INDEX "IDX_cd07cbd734fb8d7d6417a8c936"`);
        await queryRunner.query(`DROP INDEX "IDX_662dee9e9b7a5eb55be723a1da"`);
        await queryRunner.query(`DROP TABLE "spotter"`);
        await queryRunner.query(`DROP TABLE "monthly_temperature_threshold"`);
        await queryRunner.query(`DROP TABLE "daily_data"`);
        await queryRunner.query(`DROP TABLE "reef_point_of_interest"`);
        await queryRunner.query(`DROP INDEX "IDX_4dd2eeb5079abc8e070e991528"`);
        await queryRunner.query(`DROP TABLE "reef"`);
        await queryRunner.query(`DROP INDEX "IDX_de4eb243bae87587f9ca56ba8d"`);
        await queryRunner.query(`DROP TABLE "video_stream"`);
        await queryRunner.query(`DROP INDEX "IDX_af7cabf8e064aa7bad09c731ba"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_admin_level_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_46b146ce5d6ee2de43d8448562"`);
        await queryRunner.query(`DROP TABLE "region"`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS "postgis"`);
    }

}
