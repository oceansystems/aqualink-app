import {MigrationInterface, QueryRunner} from "typeorm";

export class regionsAsGeometry1599145480173 implements MigrationInterface {
    name = 'regionsAsGeometry1599145480173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "region" ADD CONSTRAINT "UQ_46b146ce5d6ee2de43d84485622" UNIQUE ("polygon")`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "region" DROP CONSTRAINT "UQ_46b146ce5d6ee2de43d84485622"`);
    }

}
