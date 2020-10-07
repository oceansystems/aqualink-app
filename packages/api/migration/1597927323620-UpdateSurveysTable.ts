import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSurveysTable1597927323620 implements MigrationInterface {
  name = 'UpdateSurveysTable1597927323620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "observations"`);
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "upload_date"`);
    await queryRunner.query(
      `CREATE TYPE "survey_weather_conditions_enum" AS ENUM('calm', 'waves', 'storm')`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "weather_conditions" "survey_weather_conditions_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "survey" ADD "comments" text NULL`);
    await queryRunner.query(
      `ALTER TABLE "survey" ALTER COLUMN "temperature" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "comments"`);
    await queryRunner.query(
      `ALTER TABLE "survey" DROP COLUMN "weather_conditions"`,
    );
    await queryRunner.query(`DROP TYPE "survey_weather_conditions_enum"`);
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "upload_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "observations" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ALTER COLUMN "temperature" SET NOT NULL`,
    );
  }
}
