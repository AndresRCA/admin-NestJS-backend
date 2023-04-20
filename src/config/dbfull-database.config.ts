// Docs: https://docs.nestjs.com/techniques/configuration#custom-configuration-files

import { registerAs } from "@nestjs/config";

/**
 * use registerAs to add a namespace for the config object, therefore creating a nested custom configuration object
 * e.g. this.configService.get<number>('database.port')
 */
export default registerAs('dbfull', () => ({
  url: process.env.DBFULL_API_URL,
  dbSae: process.env.DBFULL_DB_SAE,
  dbClubFibex: process.env.DBFULL_DB_CLUBFIBEX,
  authToken: process.env.DBFULL_AUTH_TOKEN,
  authBasic: process.env.DBFULL_AUTH_BASIC,
  encryptKey: process.env.DBFULL_ENCRYPT_KEY
}));