import {MigrationInterface, QueryRunner} from "typeorm";

export class addTimezoneAndMMM1595815693664 implements MigrationInterface {
    name = 'addTimezoneAndMMM1595815693664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef" ADD "max_monthly_mean" float`);
        await queryRunner.query(`ALTER TABLE "reef" ADD "timezone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "max_monthly_mean"`);
    }

}
