import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import * as dotenv from 'dotenv'
import { Form } from "../src/forms/entities/form.entity";
import { FormGroup } from "../src/forms/entities/form-group.entity";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Form,
    FormGroup
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  migrations: ['./migrations/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy()
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;