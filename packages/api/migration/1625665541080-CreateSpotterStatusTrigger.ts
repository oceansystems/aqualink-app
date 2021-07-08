import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpotterStatusTrigger1625665541080
  implements MigrationInterface {
  name = 'CreateSpotterStatusTrigger1625665541080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "audit_reef_status" (
        "id" SERIAL NOT NULL,
        "old_status" character varying NOT NULL,
        "new_status" character varying NOT NULL,
        "sensor_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "reef_id" integer NOT NULL,
        CONSTRAINT "PK_77f6aa781b31d8e3f7c64072121" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39195166bb789a9236f1141c1b" ON "audit_reef_status" ("old_status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1342f2628ae11aa87e66774fbe" ON "audit_reef_status" ("new_status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95246cb04db215a339f93f502d" ON "audit_reef_status" ("created_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_reef_status" ADD CONSTRAINT "FK_a5c1283f4754f328929a0390e27" FOREIGN KEY ("reef_id") REFERENCES "reef"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`
      CREATE FUNCTION log_spotter_status_change() RETURNS trigger AS $log_spotter_status_change$
        BEGIN
          IF NEW.status = OLD.status THEN
            RETURN NEW;
          END IF;

          INSERT INTO "audit_reef_status" (old_status, new_status, reef_id, sensor_id)
          VALUES (OLD.status, NEW.status, NEW.id, NEW.sensor_id);

          RETURN NEW;
        END;
      $log_spotter_status_change$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER spotter_status_trigger AFTER UPDATE ON reef
      FOR EACH ROW
      EXECUTE PROCEDURE log_spotter_status_change()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "audit_reef_status"`);

    await queryRunner.query('DROP TRIGGER "spotter_status_trigger" ON "reef"');
    await queryRunner.query('DROP FUNCTION log_spotter_status_change()');
  }
}
