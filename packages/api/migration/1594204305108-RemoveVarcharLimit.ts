import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveVarcharLimit1594204305108 implements MigrationInterface {
    name = 'RemoveVarcharLimit1594204305108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "name" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "firebase_uid" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "full_name" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "organization" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "country" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "video_stream" ALTER COLUMN "owner_email" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "reef_application" ALTER COLUMN "uid" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "reef_point_of_interest" ALTER COLUMN "name" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "spotter" ALTER COLUMN "sofar_name" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "spotter" ALTER COLUMN "hardware_version" TYPE character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spotter" ALTER COLUMN "hardware_version" TYPE character varying(50)`);
        await queryRunner.query(`ALTER TABLE "spotter" ALTER COLUMN "sofar_name" TYPE character varying(50)`);
        await queryRunner.query(`ALTER TABLE "reef_point_of_interest" ALTER COLUMN "name" TYPE character varying(50)`);
        await queryRunner.query(`ALTER TABLE "reef_application" ALTER COLUMN "uid" TYPE character varying(128)`);
        await queryRunner.query(`ALTER TABLE "video_stream" ALTER COLUMN "owner_email" TYPE character varying(254)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "country" TYPE character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "organization" TYPE character varying(254)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(254)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "full_name" TYPE character varying(254)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "firebase_uid" TYPE character varying(128)`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "name" TYPE character varying(50)`);
    }

}
