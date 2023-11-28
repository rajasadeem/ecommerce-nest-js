import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { envConfig } from './config/env.config';

const { dbName, dbUsername, dbPassword, dbHost, dbPort } = envConfig.dbConfig;
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      password: dbPassword,
      username: dbUsername,
      entities: [User],
      database: dbName,
      synchronize: true, //set 'false' for no alternation, set 'true' for db_alteration
      logging: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
