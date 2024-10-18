//src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../res/user/entities/user.entity';
import { Article } from 'src/res/article/entities/article.entity';
import { Apply } from 'src/res/apply/entities/apply.entity';
import { Favorite } from 'src/res/favorite/entities/favorite.entity';
export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1', // 데이터베이스 호스트
  port: 3306, // 데이터베이스 포트
  username: 'root', // 데이터베이스 사용자 이름
  password: 'tpgus8028~', // 데이터베이스 비밀번호
  database: 'kummate', // 데이터베이스 이름
  entities: [User, Article, Apply, Favorite],
  synchronize: false, // 프로덕션에서는 false로 설정
  logging: true,
  logger: 'advanced-console',
};

export default typeOrmModuleOptions;
