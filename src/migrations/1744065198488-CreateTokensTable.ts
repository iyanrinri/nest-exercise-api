import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTokensTable1712578912345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tokens',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            unsigned: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'token',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'IDX_TOKEN_USER_ID',
            columnNames: ['user_id'],
          },
          {
            name: 'IDX_TOKEN_CREATED_AT',
            columnNames: ['created_at'],
          },
        ],
        foreignKeys: [
          {
            name: 'FK_TOKEN_USER',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE', // Hapus token jika user dihapus
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tokens');
  }
}