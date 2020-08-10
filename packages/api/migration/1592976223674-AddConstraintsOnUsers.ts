import {MigrationInterface, QueryRunner} from "typeorm";

export class AddConstraintsOnUsers1592976223674 implements MigrationInterface {
    name = 'AddConstraintsOnUsers1592976223674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firebase_uid" DROP NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firebase_uid" SET NOT NULL`);
    }

}
