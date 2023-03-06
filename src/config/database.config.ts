// Docs: https://docs.nestjs.com/techniques/configuration#custom-configuration-files

import { registerAs } from "@nestjs/config";

/**
 * use registerAs to add a namespace for the config object, therefore creating a nested custom configuration object
 * e.g. this.configService.get<number>('database.port')
 */
export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  name: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
}));