import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addUploadedAtColumnToBooksTable1608465111449 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      const booksTable = await queryRunner.getTable('books');
      const uploadedAt = new TableColumn({name:'uploaded_at',type:'timestamp',isNullable:true});
      await queryRunner.addColumn(booksTable,uploadedAt);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const booksTable = await queryRunner.getTable('books');
        await queryRunner.dropColumn(booksTable,'uploaded_at');
    }

}
