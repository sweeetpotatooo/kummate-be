import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // 여기서 필요한 추가적인 데이터베이스 액세스 메서드를 정의할 수 있습니다.
}
