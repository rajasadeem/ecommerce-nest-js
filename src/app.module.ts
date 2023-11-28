import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { envConfig } from './config/env.config';

const { db_name, db_username, db_password, db_host, db_port } =
  envConfig.db_credentials();
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: db_host,
      port: db_port,
      password: db_password,
      username: db_username,
      entities: [User],
      database: db_name,
      synchronize: true, //set 'false' for no alternation, set 'true' for db alteration
      logging: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
