import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';

declare const module: any; // used for hot reload (see https://docs.nestjs.com/recipes/hot-reload#hot-module-replacement)

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  /**
   * this is just a different way to access .env variables other than process.env, not strictly needed here in main.ts 
   * but used to keep things consistent between files.
   * Case in point: ctrl+shift+f would show this file as well if someone wanted to rename some variable name globally)
   */
  const configService = app.get(ConfigService);

  /*--- security middleware ---*/
  await app.register(helmet, { // When using fastify and helmet, there may be a problem with CSP, this is how to solve this collision (with swagger)
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  app.enableCors();
  /*---------------------------*/

  /*----- cookies parsing -----*/
  await app.register(fastifyCookie, {
    parseOptions: {
      secure: configService.get('NODE_ENV') === 'production',
      httpOnly: true,
      signed: true,
      domain: configService.get('DOMAIN'),
      path: '/'
    },
    secret: configService.get('COOKIE_SECRET'), // for cookies signature
  });
  /*---------------------------*/

  // employ nestjs request body validation using DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // @Body, @Param, and @Query parameter types will be transformed to what type you declare them (e.g. @Param('id') id: number -> typeof id => number)
      whitelist: true, // remove any extra properties from incoming payload
      forbidNonWhitelisted: true, // forbid requests with incoming payload that don't follow a scheme (dto),
      disableErrorMessages: configService.get('NODE_ENV') === 'production' // in production mode remove detailed error messages for validation
    })
  )
  
  // swagger documentation setup (for this project, API documentation should only be visible when developing...)
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('AdminISPV1 Backend')
      .setDescription('API Documentation')
      .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'X-API-Key')
      .setVersion('v' + configService.get<string>('API_VERSION')!)
      .build();

    const options: SwaggerDocumentOptions =  {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    };
    
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.get<number>('port')!);
  console.log(`Application is running on: http://localhost:${configService.get('port')}`);

  // this block refers to https://docs.nestjs.com/recipes/hot-reload#hot-module-replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
