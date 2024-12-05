import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1691981664875 implements MigrationInterface {
  name = 'CreateTables1691981664875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_name" "public"."roles_role_name_enum" NOT NULL, CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "permission" "public"."permissions_permission_enum" NOT NULL, CONSTRAINT "UQ_efcbbce13db89dbd3ef8b7690ae" UNIQUE ("permission"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_0cd11f0b35c4d348c6ebb9b36b7" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7d2dad9f14eddeb09c256fea71" ON "roles_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_337aa8dba227a1fe6b73998307" ON "roles_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719" FOREIGN KEY ("role_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_337aa8dba227a1fe6b73998307b" FOREIGN KEY ("permission_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_337aa8dba227a1fe6b73998307b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_337aa8dba227a1fe6b73998307"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7d2dad9f14eddeb09c256fea71"`,
    );
    await queryRunner.query(`DROP TABLE "roles_permissions"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
