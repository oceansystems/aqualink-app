import { MigrationInterface, QueryRunner } from "typeorm";

export class addConstraintsChangeUserTable1593053560029 implements MigrationInterface {
    name = 'addConstraintsChangeUserTable1593053560029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "IDX_af7cabf8e064aa7bad09c731ba"`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(Polygon)`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_a37da0d039df5145bd187a32e09"`);
        await queryRunner.query(`ALTER TABLE "survey_image" DROP CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7"`);
        await queryRunner.query(`ALTER TABLE "survey_video" DROP CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e"`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" DROP CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d"`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294"`);
        await queryRunner.query(`ALTER TABLE \"user\" RENAME TO users;`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "users_id_seq" OWNED BY "users"."id"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "full_name" character varying(254) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organization"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "organization" character varying(254)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "country" character varying(50)`);
        await queryRunner.query(`ALTER TYPE "public"."user_admin_level_enum" RENAME TO "users_admin_level_enum_old"`);
        await queryRunner.query(`CREATE TYPE "users_admin_level_enum" AS ENUM('default', 'reef_manager', 'super_admin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "admin_level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "admin_level" TYPE "users_admin_level_enum" USING "admin_level"::"text"::"users_admin_level_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "admin_level" SET DEFAULT 'default'`);
        await queryRunner.query(`DROP TYPE "users_admin_level_enum_old"`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP COLUMN "uid"`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD "uid" character varying(128) NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_15b3fe608b52f34df363512e39" ON "users" USING GiST ("location") `);
        await queryRunner.query(`ALTER TABLE "reef" ADD CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" ADD CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d" FOREIGN KEY ("user_update") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_a37da0d039df5145bd187a32e09" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_image" ADD CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_video" ADD CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP EXTENSION IF EXISTS "pgcrypto"`);
        await queryRunner.query(`ALTER TABLE "survey_video" DROP CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e"`);
        await queryRunner.query(`ALTER TABLE "survey_image" DROP CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_a37da0d039df5145bd187a32e09"`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" DROP CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d"`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294"`);
        await queryRunner.query(`DROP INDEX "IDX_15b3fe608b52f34df363512e39"`);
        await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP COLUMN "uid"`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD "uid" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`CREATE TYPE "users_admin_level_enum_old" AS ENUM('default', 'reef_manager', 'super_admin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "admin_level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "admin_level" TYPE "users_admin_level_enum_old" USING "admin_level"::"text"::"users_admin_level_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "admin_level" SET DEFAULT 'default'`);
        await queryRunner.query(`DROP SEQUENCE IF EXISTS "users_id_seq"`);
        await queryRunner.query(`DROP TYPE "users_admin_level_enum"`);
        await queryRunner.query(`ALTER TYPE "users_admin_level_enum_old" RENAME TO  "user_admin_level_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organization"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "organization" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "full_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE users RENAME TO "user";`);
        await queryRunner.query(`ALTER TABLE "reef" ADD CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_temperature_threshold" ADD CONSTRAINT "FK_f76ea5d5e9fa63e2c08747a3d2d" FOREIGN KEY ("user_update") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_video" ADD CONSTRAINT "FK_352ae17e348cefa40d60bd2c76e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_image" ADD CONSTRAINT "FK_0cc86911e0b38bfd04e5e896fc7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_a37da0d039df5145bd187a32e09" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(POLYGON,0)`);
        await queryRunner.query(`CREATE INDEX "IDX_af7cabf8e064aa7bad09c731ba" ON "user" USING GiST ("location") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

}
