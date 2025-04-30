import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

const appModules = [
  UsersModule,
  AuthModule
]
const config = configuration();
console.log('config', config.database);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
 ...appModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
