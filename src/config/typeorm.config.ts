import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost', // MySQL host
  port: 3306, // MySQL port
  username: 'root', // MySQL username (default is usually 'root')
  password: 'tpgus8028~', // MySQL password
  database: 'kummate', // MySQL database name
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // Entity file patterns remain the same
  synchronize: true, // Synchronize the database schema with entities
};
