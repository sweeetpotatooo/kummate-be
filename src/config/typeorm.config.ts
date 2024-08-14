// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../res/user/entities/user.entity';
import { Post } from '../res/post/entities/post.entity';
import { Login } from 'src/res/login/entities/login.entity';

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'tpgus8028~',
  database: 'kumprac',
  entities: [User, Post, Login], // 엔티티를 여기 추가
  synchronize: true, // 개발 환경에서만 true로 설정
  logging: true,
};
