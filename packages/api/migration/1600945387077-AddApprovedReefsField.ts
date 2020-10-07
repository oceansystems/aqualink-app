import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApprovedReefsField1600945387077 implements MigrationInterface {
  name = 'AddApprovedReefsField1600945387077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reef" ADD "approved" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "approved"`);
  }
}
