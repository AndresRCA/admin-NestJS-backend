import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import httpConfig from './config/http.config';
import databaseConfig from './config/database.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormGroup } from './forms/entities/form-group.entity';
import { Form } from './forms/entities/form.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './auth/entities/user.entity';
import { Session } from './auth/entities/session.entity';

@Module({
  imports: [
    // .env loading
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`, // NODE_ENV should be set by the npm script
      isGlobal: true,
      cache: true, // increase the performance of ConfigService#get method when it comes to variables stored in process.env
      load: [ // .config.ts files define properties based on process.env variables and converts strings to other types if needed, or adds default values
        httpConfig,
        databaseConfig
      ],
    }),
    // index.html serving
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../frontend', 'dist'),
    }),
    // request throttler
    ThrottlerModule.forRoot({
      ttl: 15 * 60, // 15 minutes seconds
      limit: 100, // 100 max requests per 15 minutes
    }),
    // load TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [
          Form,
          FormGroup,
          User,
          Session
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        migrations: ['../migrations/*{.ts,.js}'],
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FormsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // by setting up this provider, ThrottlerGuard is now used globally
    },
    AppService
  ],
})
export class AppModule {}
