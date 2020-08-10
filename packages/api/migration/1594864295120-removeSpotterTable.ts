import {MigrationInterface, QueryRunner} from "typeorm";

export class removeSpotterTable1594864295120 implements MigrationInterface {
    name = 'removeSpotterTable1594864295120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef" ADD "spotter_id" character varying`);
        await queryRunner.query(`ALTER TABLE "spotter" DROP CONSTRAINT "FK_29055018df0d986236e70f1d7f0"`);
        await queryRunner.query(`DROP TABLE "spotter"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "spotter_id"`);
        await queryRunner.query(`CREATE TABLE "spotter" ("id" SERIAL NOT NULL, "sofar_name" character varying(50) NOT NULL, "location" point NOT NULL, "hardware_version" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reef_id" integer, CONSTRAINT "PK_d096178b8cb4371cf6c4e5f993d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_662dee9e9b7a5eb55be723a1da" ON "spotter" ("sofar_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd07cbd734fb8d7d6417a8c936" ON "spotter" USING GiST ("location") `);
        await queryRunner.query(`ALTER TABLE "spotter" ADD CONSTRAINT "FK_29055018df0d986236e70f1d7f0" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
