import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

const sqlUrl = process.env.DATABASE_URL;

if (!sqlUrl) throw new Error('invalid sql url var');

export default new DataSource({
  type: 'postgres',
  url: sqlUrl,
  logging: true,
  entities: [
    join(__dirname, 'src/shared/db/typeorm/entities/*.entity{.ts,.js}'),
    join(
      __dirname,
      'src/shared/db/typeorm/entities/control-wizard/*.entity{.ts,.js}',
    ),
  ],
  migrations: [join(__dirname, 'src/shared/db/typeorm/migrations/*.ts')],
  synchronize: false,
});
