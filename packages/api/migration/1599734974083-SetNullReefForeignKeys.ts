import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetNullReefForeignKeys1599734974083 implements MigrationInterface {
  name = 'SetNullReefForeignKeys1599734974083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reef" DROP CONSTRAINT "FK_63c63e16bcebffa7ab94aaddbdb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef" DROP CONSTRAINT "FK_073078b9b04d1501c3c373fe1b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef" ADD CONSTRAINT "FK_073078b9b04d1501c3c373fe1b8" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef" ADD CONSTRAINT "FK_63c63e16bcebffa7ab94aaddbdb" FOREIGN KEY ("stream_id") REFERENCES "video_stream"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reef" DROP CONSTRAINT "FK_63c63e16bcebffa7ab94aaddbdb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef" DROP CONSTRAINT "FK_073078b9b04d1501c3c373fe1b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef" ADD CONSTRAINT "FK_073078b9b04d1501c3c373fe1b8" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reef" ADD CONSTRAINT "FK_63c63e16bcebffa7ab94aaddbdb" FOREIGN KEY ("stream_id") REFERENCES "video_stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
