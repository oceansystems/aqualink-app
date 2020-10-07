import {MigrationInterface, QueryRunner} from "typeorm";

export class addAlertToDailyData1601323003292 implements MigrationInterface {
    name = 'addAlertToDailyData1601323003292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "daily_data" ADD "daily_alert_level" integer`);
        await queryRunner.query(`ALTER TABLE "daily_data" ADD "weekly_alert_level" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "daily_data" DROP COLUMN "weekly_alert_level"`);
        await queryRunner.query(`ALTER TABLE "daily_data" DROP COLUMN "daily_alert_level"`);
    }

}
