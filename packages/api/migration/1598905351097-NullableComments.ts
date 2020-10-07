import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableComments1598905351097 implements MigrationInterface {
    name = 'NullableComments1598905351097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_media" ALTER COLUMN "comments" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_media" ALTER COLUMN "comments" SET NOT NULL`);
    }

}
