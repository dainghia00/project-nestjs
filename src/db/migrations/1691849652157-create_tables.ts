import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1691849652157 implements MigrationInterface {
    name = 'CreateTables1691849652157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_f10931e7bb05a3b434642ed2797"`);
        await queryRunner.query(`CREATE TABLE "role_permissions_permission" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_32d63c82505b0b1d565761ae201" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0167acb6e0ccfcf0c6c140cec4" ON "role_permissions_permission" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2d3e8e7c82bdee8553b6f1e332" ON "role_permissions_permission" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_0167acb6e0ccfcf0c6c140cec4a" FOREIGN KEY ("role_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_2d3e8e7c82bdee8553b6f1e3325" FOREIGN KEY ("permission_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_2d3e8e7c82bdee8553b6f1e3325"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_0167acb6e0ccfcf0c6c140cec4a"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "role_id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d3e8e7c82bdee8553b6f1e332"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0167acb6e0ccfcf0c6c140cec4"`);
        await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
