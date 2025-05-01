import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from '../config/configuration';

const config = configuration();
export const ormconfig: TypeOrmModuleOptions = {
	type: 'mysql',
	host: config.database.host,
	port: config.database.port,
	username: config.database.username,
	password: config.database.password,
	database: config.database.name,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], 
  logging: true,
	synchronize: true,
};
