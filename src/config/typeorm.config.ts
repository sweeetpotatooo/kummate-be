//src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../res/user/entities/user.entity';
import { Article } from 'src/res/article/entities/article.entity';
import { Apply } from 'src/res/apply/entities/apply.entity';
import { Favorite } from 'src/res/favorite/entities/favorite.entity';
import { Message } from 'src/res/chat/entities/message.entity';
import { ChatRoom } from 'src/res/chat/entities/chatRoom.entity';
export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '34.22.92.240', // 데이터베이스 호스트
  port: 3306, // 데이터베이스 포트
  username: 'root',
  password: 'tpgus8028~',
  database: 'kummate',
  entities: [User, Article, Apply, Favorite, ChatRoom, Message],
  synchronize: false, // 프로덕션에서는 false로 설정
  logging: true,
  logger: 'advanced-console',
};

export default typeOrmModuleOptions;
