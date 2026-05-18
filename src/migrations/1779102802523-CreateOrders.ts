import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrders1779102802523 implements MigrationInterface {
    name = 'CreateOrders1779102802523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_145532db85752b29c57d2b7b1f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9263386c35b6b242540f9493b0"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "PK_6335813ef19bc35b8d866cc6565"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "PK_9263386c35b6b242540f9493b00" PRIMARY KEY ("product_id")`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "PK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "orderId" integer`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "totalPrice" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "PK_005269d8574e6fac0493715c308"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "product_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "PK_9263386c35b6b242540f9493b00" PRIMARY KEY ("product_id")`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "order_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "PK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "PK_6335813ef19bc35b8d866cc6565" PRIMARY KEY ("order_id", "product_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_9263386c35b6b242540f9493b0" ON "order_items" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_145532db85752b29c57d2b7b1f" ON "order_items" ("order_id") `);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
