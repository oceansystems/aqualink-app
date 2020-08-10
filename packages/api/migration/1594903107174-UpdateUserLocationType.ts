import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserLocationType1594903107174 implements MigrationInterface {
    name = 'UpdateUserLocationType1594903107174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "location" TYPE geometry(Point,4326) USING location::geometry(Point,4326)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
    }

}
