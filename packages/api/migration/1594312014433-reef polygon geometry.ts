import { MigrationInterface, QueryRunner } from "typeorm";

export class reefPolygonGeometry1594312014433 implements MigrationInterface {
    name = 'reefPolygonGeometry1594312014433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(Polygon)`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(POLYGON,0)`);
    }
}
