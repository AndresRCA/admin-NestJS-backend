// Docs: https://docs.nestjs.com/techniques/configuration#custom-configuration-files

/**
 * Define any property/variable that need some sort of type conversion or default values, or use this for
 * configuration object for creating a nested custom configuration object (e.g. this.configService.get<number>('database.port'))
 * 
 * Note: env variables that are pressumed to be processed will be in lowercase, while raw variables will remain in uppercase
 * e.g.
 *  console.log(typeof this.configService.get('port')) // number
 *  console.log(typeof this.configService.get('PORT')) // string
 */
export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000
});