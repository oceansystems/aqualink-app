import { MigrationInterface, QueryRunner } from "typeorm";

export class waveHeightNotLength1594166316583 implements MigrationInterface {
    name = 'waveHeightNotLength1594166316583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "daily_data" RENAME COLUMN "min_wave_speed" TO "min_wave_height"`);
        await queryRunner.query(`ALTER TABLE "daily_data" RENAME COLUMN "max_wave_speed" TO "max_wave_height"`);
        await queryRunner.query(`ALTER TABLE "daily_data" RENAME COLUMN "avg_wave_speed" TO "avg_wave_height"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "daily_data" RENAME COLUMN "min_wave_height" TO "min_wave_speed"`);
        await queryRunner.query(`ALTER TABLE "daily_data" RENAME COLUMN "max_wave_height" TO "max_wave_speed"`);
        await queryRunner.query(`ALTER TABLE "daily_data" RENAME COLUMN "avg_wave_height" TO "avg_wave_speed"`);
    }
}
