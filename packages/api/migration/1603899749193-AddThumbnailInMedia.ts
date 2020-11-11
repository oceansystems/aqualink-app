import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThumbnailInMedia1603899749193 implements MigrationInterface {
  name = 'AddThumbnailInMedia1603899749193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_media" RENAME COLUMN "url" TO "image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_media" ADD "thumbnail_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_media" DROP COLUMN "thumbnail_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_media" RENAME COLUMN "image_url" TO "url"`,
    );
  }
}
