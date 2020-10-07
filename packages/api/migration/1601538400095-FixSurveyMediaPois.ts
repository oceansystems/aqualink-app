import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSurveyMediaPois1601538400095 implements MigrationInterface {
  name = 'FixSurveyMediaPois1601538400095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_media" DROP CONSTRAINT "FK_cdb564bc26282caa4e81306cc92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_media" ADD CONSTRAINT "FK_cdb564bc26282caa4e81306cc92" FOREIGN KEY ("poi_id") REFERENCES "reef_point_of_interest"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_media" DROP CONSTRAINT "FK_cdb564bc26282caa4e81306cc92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_media" ADD CONSTRAINT "FK_cdb564bc26282caa4e81306cc92" FOREIGN KEY ("poi_id") REFERENCES "reef_point_of_interest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
