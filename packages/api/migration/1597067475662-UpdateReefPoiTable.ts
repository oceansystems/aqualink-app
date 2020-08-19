import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateReefPoiTable1597067475662 implements MigrationInterface {
    name = 'UpdateReefPoiTable1597067475662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef_point_of_interest" ALTER COLUMN "poi_label_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef_point_of_interest" ALTER COLUMN "image_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef_point_of_interest" ALTER COLUMN "image_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef_point_of_interest" ALTER COLUMN "poi_label_id" SET NOT NULL`);
    }

}
