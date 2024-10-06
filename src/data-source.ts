import { DataSource } from 'typeorm';
import { User } from './res/user/entities/user.entity';
import { Article } from './res/article/entities/article.entity'; // 다른 엔티티들 추가

export const AppDataSource = new DataSource({
  type: 'mysql', // 사용할 데이터베이스 유형
  host: 'localhost', // 데이터베이스 호스트
  port: 3306, // MySQL의 기본 포트
  username: 'root', // 데이터베이스 사용자
  password: 'tpgus8028~', // 사용자 비밀번호
  database: 'kummate', // 사용할 데이터베이스 이름
  synchronize: false, // true면 자동으로 데이터베이스와 엔티티를 동기화 (운영 환경에서는 false 권장)
  logging: true, // 쿼리 로깅 여부
  entities: [User, Article], // 엔티티 목록
});
