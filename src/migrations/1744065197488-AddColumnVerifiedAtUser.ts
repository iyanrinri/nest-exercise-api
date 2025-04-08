import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddColumnVerifiedAtUser1744065197488
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email_verified_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Add index on the new column
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL_VERIFIED',
        columnNames: ['email_verified_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'email_verified_at');
  }
}
