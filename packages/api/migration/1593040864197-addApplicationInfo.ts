import { MigrationInterface, QueryRunner } from "typeorm";

export class addApplicationInfo1593040864197 implements MigrationInterface {
    name = 'addApplicationInfo1593040864197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reef_application" ("id" SERIAL NOT NULL, "permit_requirements" character varying, "funding_source" character varying, "installation_schedule" TIMESTAMP, "installation_resources" character varying, "uid" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reef_id" integer, "user_id" integer, CONSTRAINT "PK_41c0818e19c90834a1fb05be037" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organization" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(Polygon) USING polygon::geometry(Polygon)`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry USING polygon::geometry(Polygon)`);
        await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "reef" ADD "status" integer`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "status" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "FK_77d33d9b9602120cd1529312e77" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reef_application" ADD CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "FK_a3ff599da8838fd358d43cec7bc"`);
        await queryRunner.query(`ALTER TABLE "reef_application" DROP CONSTRAINT "FK_77d33d9b9602120cd1529312e77"`);
        await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "reef" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reef" ALTER COLUMN "polygon" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "polygon" TYPE geometry(POLYGON,0)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organization"`);
        await queryRunner.query(`DROP TABLE "reef_application"`);
    }
}
