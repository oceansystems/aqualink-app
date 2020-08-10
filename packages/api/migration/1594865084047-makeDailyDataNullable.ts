import {MigrationInterface, QueryRunner} from "typeorm";

export class makeDailyDataNullable1594865084047 implements MigrationInterface {
    name = 'makeDailyDataNullable1594865084047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "min_bottom_temperature" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "max_bottom_temperature" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "avg_bottom_temperature" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "degree_heating_days" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "surface_temperature" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "satellite_temperature" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "min_wave_height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "max_wave_height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "avg_wave_height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "wave_direction" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "wave_period" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "min_wind_speed" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "max_wind_speed" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "avg_wind_speed" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "wind_direction" DROP NOT NULL`);
        await queryRunner.query(`CREATE EXTENSION btree_gist`);
        await queryRunner.query(`ALTER TABLE "daily_data" ADD CONSTRAINT no_duplicated_date EXCLUDE USING GIST (reef_id WITH =, DATE(date) WITH =)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "daily_data" DROP CONSTRAINT no_duplicate_date`);
        await queryRunner.query(`DROP EXTENSION btree_gist`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "wind_direction" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "avg_wind_speed" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "max_wind_speed" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "min_wind_speed" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "wave_period" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "wave_direction" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "avg_wave_height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "max_wave_height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "min_wave_height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "satellite_temperature" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "surface_temperature" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "degree_heating_days" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "avg_bottom_temperature" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "max_bottom_temperature" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "daily_data" ALTER COLUMN "min_bottom_temperature" SET NOT NULL`);
    }

}
