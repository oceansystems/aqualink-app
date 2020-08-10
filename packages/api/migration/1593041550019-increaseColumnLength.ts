import {MigrationInterface, QueryRunner} from "typeorm";

export class increaseColumnLength1593041550019 implements MigrationInterface {
    name = 'increaseColumnLength1593041550019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(Polygon)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "full_name" character varying(254) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organization"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organization" character varying(254)`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organization"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organization" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "full_name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(POLYGON,0)`);
    }

}
