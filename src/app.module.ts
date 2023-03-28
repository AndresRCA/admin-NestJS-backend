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
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './auth/entities/user.entity';
import { Session } from './auth/entities/session.entity';
import { Module as UserModule } from './auth/entities/module.entity';
import { Role } from './auth/entities/role.entity';
import { DynamicContentModule } from './dynamic-content/dynamic-content.module';
import { ContentBlock } from './dynamic-content/entities/content-block.entity';
import { FormControl } from './dynamic-content/entities/form-control.entity';
import { FormGroup } from './dynamic-content/entities/form-group.entity';
import { Form } from './dynamic-content/entities/form.entity';
import { ActionButton } from './dynamic-content/entities/action-button.entity';
import { FormFilter } from './dynamic-content/entities/form-filter.entity';

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
      ttl: 30, // 30 seconds
      limit: 60, // 50 max requests per 30 seconds (per user)
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
          FormControl,
          User,
          Role,
          Session,
          UserModule,
          ContentBlock,
          FormFilter,
          ActionButton
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DynamicContentModule,
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
