import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1684592431776 implements MigrationInterface {
    name = 'Initial1684592431776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "asset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "original_name" character varying, "original_path" character varying, "uploaded_path" character varying NOT NULL, "uploaded_bucket" character varying NOT NULL, "owner_id" uuid, CONSTRAINT "UQ_5b6962bcc14aaf3ee86346e322f" UNIQUE ("uploaded_path"), CONSTRAINT "UQ_14464de4e26549890f7a1892cef" UNIQUE ("type", "uploaded_bucket", "uploaded_path"), CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_37ac8e73568722867e6a1f8346" ON "asset" ("type") `);
        await queryRunner.query(`CREATE TABLE "person_alias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "alias" character varying NOT NULL, "person_id" uuid, CONSTRAINT "UQ_f9f908c506d6de1b4beeac9d284" UNIQUE ("alias"), CONSTRAINT "PK_d366e72b84decfa51e7fa638bc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_label" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_39fba5676fcf76bf4c79920c928" UNIQUE ("name"), CONSTRAINT "PK_cb58407551f39f22ac8df128152" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_maker" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_0ea9f0f4410c045117f2dae6f6d" UNIQUE ("name"), CONSTRAINT "PK_21a0451243f73cd99bbe676f285" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_ee1fd1b3f39b5b88109bdb46230" UNIQUE ("name"), CONSTRAINT "PK_b0aef737939ec02a1ab9345b044" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "code" character varying NOT NULL, "title" character varying, "release_date" TIMESTAMP, "length" integer, "label_id" uuid, "maker_id" uuid, CONSTRAINT "UQ_aa44b0f8bde6d6a96821c458d1b" UNIQUE ("code"), CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "person_directed_video" ("person_id" uuid NOT NULL, "video_id" uuid NOT NULL, CONSTRAINT "PK_452b156efa5eee094e17a07ab81" PRIMARY KEY ("person_id", "video_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2fd0474a0de31623a3bb78fe75" ON "person_directed_video" ("person_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1eba3acb3ea8e83aae6eb9d57e" ON "person_directed_video" ("video_id") `);
        await queryRunner.query(`CREATE TABLE "person_starred_video" ("person_id" uuid NOT NULL, "video_id" uuid NOT NULL, CONSTRAINT "PK_7e4f16052b7931573df55029e0b" PRIMARY KEY ("person_id", "video_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_58c766deae0ca96b4a1297fa65" ON "person_starred_video" ("person_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e64ef00105f916822c1e6cf47d" ON "person_starred_video" ("video_id") `);
        await queryRunner.query(`CREATE TABLE "video_tags_video_tag" ("video_id" uuid NOT NULL, "video_tag_id" uuid NOT NULL, CONSTRAINT "PK_c00989af5bff61911e8ee0dcbad" PRIMARY KEY ("video_id", "video_tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0c2feec221cf17df085c3bbcb6" ON "video_tags_video_tag" ("video_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b2acefee77bf8b4ad7f15a7c1" ON "video_tags_video_tag" ("video_tag_id") `);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_fd773efb2eff5ead1948f3dc1f9" FOREIGN KEY ("owner_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "person_alias" ADD CONSTRAINT "FK_2a54055b3155a548526ae7d9c15" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_cb58407551f39f22ac8df128152" FOREIGN KEY ("label_id") REFERENCES "video_label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_21a0451243f73cd99bbe676f285" FOREIGN KEY ("maker_id") REFERENCES "video_maker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "person_directed_video" ADD CONSTRAINT "FK_2fd0474a0de31623a3bb78fe75d" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "person_directed_video" ADD CONSTRAINT "FK_1eba3acb3ea8e83aae6eb9d57e2" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "person_starred_video" ADD CONSTRAINT "FK_58c766deae0ca96b4a1297fa65f" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "person_starred_video" ADD CONSTRAINT "FK_e64ef00105f916822c1e6cf47da" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_tags_video_tag" ADD CONSTRAINT "FK_0c2feec221cf17df085c3bbcb62" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "video_tags_video_tag" ADD CONSTRAINT "FK_7b2acefee77bf8b4ad7f15a7c11" FOREIGN KEY ("video_tag_id") REFERENCES "video_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_tags_video_tag" DROP CONSTRAINT "FK_7b2acefee77bf8b4ad7f15a7c11"`);
        await queryRunner.query(`ALTER TABLE "video_tags_video_tag" DROP CONSTRAINT "FK_0c2feec221cf17df085c3bbcb62"`);
        await queryRunner.query(`ALTER TABLE "person_starred_video" DROP CONSTRAINT "FK_e64ef00105f916822c1e6cf47da"`);
        await queryRunner.query(`ALTER TABLE "person_starred_video" DROP CONSTRAINT "FK_58c766deae0ca96b4a1297fa65f"`);
        await queryRunner.query(`ALTER TABLE "person_directed_video" DROP CONSTRAINT "FK_1eba3acb3ea8e83aae6eb9d57e2"`);
        await queryRunner.query(`ALTER TABLE "person_directed_video" DROP CONSTRAINT "FK_2fd0474a0de31623a3bb78fe75d"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_21a0451243f73cd99bbe676f285"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_cb58407551f39f22ac8df128152"`);
        await queryRunner.query(`ALTER TABLE "person_alias" DROP CONSTRAINT "FK_2a54055b3155a548526ae7d9c15"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_fd773efb2eff5ead1948f3dc1f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b2acefee77bf8b4ad7f15a7c1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c2feec221cf17df085c3bbcb6"`);
        await queryRunner.query(`DROP TABLE "video_tags_video_tag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e64ef00105f916822c1e6cf47d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58c766deae0ca96b4a1297fa65"`);
        await queryRunner.query(`DROP TABLE "person_starred_video"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1eba3acb3ea8e83aae6eb9d57e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2fd0474a0de31623a3bb78fe75"`);
        await queryRunner.query(`DROP TABLE "person_directed_video"`);
        await queryRunner.query(`DROP TABLE "video"`);
        await queryRunner.query(`DROP TABLE "video_tag"`);
        await queryRunner.query(`DROP TABLE "video_maker"`);
        await queryRunner.query(`DROP TABLE "video_label"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`DROP TABLE "person_alias"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37ac8e73568722867e6a1f8346"`);
        await queryRunner.query(`DROP TABLE "asset"`);
    }

}
