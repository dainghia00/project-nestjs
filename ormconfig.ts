import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { commonDbConfig } from 'src/db/common-db-config';


dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ...commonDbConfig,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
