import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddIsActiveToProducts1775668947684 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
