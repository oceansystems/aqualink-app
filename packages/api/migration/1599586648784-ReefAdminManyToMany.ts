import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReefAdminManyToMany1599586648784 implements MigrationInterface {
  name = 'ReefAdminManyToMany1599586648784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reef" DROP CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294"`,
    );
    await queryRunner.query(
      `
      CREATE TABLE "users_administered_reefs_reef" (
        "reef_id" integer NOT NULL,
        "users_id" integer NOT NULL,
        CONSTRAINT "PK_21f162e26e837a19d1e1accd1cd" PRIMARY KEY ("reef_id", "users_id")
      )
      `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_088a629ef23eb9eba6ac857ed6" ON "users_administered_reefs_reef" ("reef_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_da52b9542bf7df43f4840ae439" ON "users_administered_reefs_reef" ("users_id") `,
    );
    await queryRunner.query(`ALTER TABLE "reef" DROP COLUMN "admin_id"`);
    await queryRunner.query(
      `
      ALTER TABLE "users_administered_reefs_reef" ADD CONSTRAINT "FK_088a629ef23eb9eba6ac857ed62"
      FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `
      ALTER TABLE "users_administered_reefs_reef" ADD CONSTRAINT "FK_da52b9542bf7df43f4840ae4394"
      FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `ALTER TABLE "reef_application" DROP CONSTRAINT "FK_77d33d9b9602120cd1529312e77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef_application" DROP CONSTRAINT "UQ_77d33d9b9602120cd1529312e77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef_application" ADD CONSTRAINT "FK_77d33d9b9602120cd1529312e77" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_administered_reefs_reef" DROP CONSTRAINT "FK_da52b9542bf7df43f4840ae4394"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_administered_reefs_reef" DROP CONSTRAINT "FK_088a629ef23eb9eba6ac857ed62"`,
    );
    await queryRunner.query(`ALTER TABLE "reef" ADD "admin_id" integer`);
    await queryRunner.query(`DROP INDEX "IDX_da52b9542bf7df43f4840ae439"`);
    await queryRunner.query(`DROP INDEX "IDX_088a629ef23eb9eba6ac857ed6"`);
    await queryRunner.query(`DROP TABLE "users_administered_reefs_reef"`);
    await queryRunner.query(
      `
      ALTER TABLE "reef" ADD CONSTRAINT "FK_dc56bfd6bfcd1f221ec83885294"
      FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
    await queryRunner.query(
      `ALTER TABLE "reef_application" DROP CONSTRAINT "FK_77d33d9b9602120cd1529312e77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef_application" ADD CONSTRAINT "UQ_77d33d9b9602120cd1529312e77" UNIQUE ("reef_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef_application" ADD CONSTRAINT "FK_77d33d9b9602120cd1529312e77" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
