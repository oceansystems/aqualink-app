import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReefApplicationTable1593032857836 implements MigrationInterface {
    name = 'AddReefApplicationTable1593032857836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(Polygon) USING polygon::geometry(Polygon)`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry USING polygon::geometry(Polygon)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(POLYGON,0)`);
    }

}
