import { MigrationInterface, QueryRunner } from "typeorm";

export class updateMoreConstraints1593058528731 implements MigrationInterface {
    name = 'updateMoreConstraints1593058528731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(Polygon)`);
        await queryRunner.query(`ALTER TABLE "survey_image" DROP CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7"`);
        await queryRunner.query(`ALTER TABLE "survey_video" DROP CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e"`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" DROP CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_a37da0d039df5145bd187a32e09"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294"`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "users_id_seq" OWNED BY "users"."id"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "full_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "reef" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "reef" ADD CONSTRAINT "UQ_4dd2eeb5079abc8e070e9915286" UNIQUE ("polygon")`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "temperature_threshold" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "depth" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "FK_77d33d9b9602120cd1529312e77"`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "UQ_adfd79a75e1f1b576138711e9b5" UNIQUE ("uid")`);
        await queryRunner.query(`ALTER TABLE "reef_application" ALTER COLUMN "uid" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE IF EXISTS "reef_application_uid_seq"`);
        await queryRunner.query(`ALTER TABLE "reef_application" ALTER COLUMN "uid" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "UQ_77d33d9b9602120cd1529312e77" UNIQUE ("reef_id")`);
        await queryRunner.query(`ALTER TABLE "reef" ADD CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "FK_77d33d9b9602120cd1529312e77" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" ADD CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d" FOREIGN KEY ("user_update") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_a37da0d039df5145bd187a32e09" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_image" ADD CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_video" ADD CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_video" DROP CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e"`);
        await queryRunner.query(`ALTER TABLE "survey_image" DROP CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_a37da0d039df5145bd187a32e09"`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" DROP CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d"`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc"`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "FK_77d33d9b9602120cd1529312e77"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294"`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "UQ_77d33d9b9602120cd1529312e77"`);
        await queryRunner.query(`ALTER TABLE "reef_application" ALTER COLUMN "uid" DROP DEFAULT`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "reef_application_uid_seq" OWNED BY "reef_application"."uid"`);
        await queryRunner.query(`ALTER TABLE "reef_application" ALTER COLUMN "uid" SET DEFAULT nextval('reef_application_uid_seq')`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "UQ_adfd79a75e1f1b576138711e9b5"`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "FK_77d33d9b9602120cd1529312e77" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "depth" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "temperature_threshold" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "reef" DROP CONSTRAINT "UQ_4dd2eeb5079abc8e070e9915286"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "reef" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "full_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE IF EXISTS "users_id_seq"`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef" ADD CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_a37da0d039df5145bd187a32e09" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" ADD CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d" FOREIGN KEY ("user_update") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_video" ADD CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_image" ADD CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(POLYGON,0)`);
    }

}
