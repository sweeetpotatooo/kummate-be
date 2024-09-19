// src/repository/user.repository.ts

import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // findByEmail 메서드
  async findByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.tag', 'tag')
      .where('user.email = :email', { email })
      .getOne();
  }

  // countByEmail 메서드
  async countByEmail(email: string): Promise<number> {
    return this.count({ where: { email } });
  }

  // countByNickname 메서드
  async countByNickname(nickname: string): Promise<number> {
    return this.count({ where: { nickname } });
  }

  // existsByEmailOrNickname 메서드
  async existsByEmailOrNickname(
    email: string,
    nickname: string,
  ): Promise<boolean> {
    const count = await this.count({
      where: [{ email }, { nickname }],
    });
    return count > 0;
  }
  /*
  // getRecommend 메서드 - 복잡한 QueryBuilder 사용
  async getRecommend(user: User, size: number): Promise<User[]> {
    const subQuery = this.createQueryBuilder('article')
      .select('article.user')
      .from('article', 'article')
      .where('article.isDeleted = false')
      .andWhere('article.isRecruiting = true');

    const query = this.createQueryBuilder('user')
      .where(this.eqGender(user))
      .andWhere(this.eqSmoker(user))
      .andWhere(this.preferAge(user))
      .andWhere(this.eqRegion(user))
      .andWhere(this.neSelf(user))
      .andWhere(this.eqActivityTime(user))
      .andWhere(this.userInSubQuery(subQuery))
      .orderBy('RAND()') // 랜덤 정렬, SQL에서 RAND() 사용
      .limit(size);

    return query.getMany();
  }
*/
  // BooleanExpression에 해당하는 조건 메서드들
  private eqEmail(email: string): string {
    return `user.email = '${email}'`;
  }

  private eqGender(user: User): string {
    return `user.gender = '${user.gender}'`;
  }

  private eqSmoker(user: User): string {
    return `user.isSmoker = ${user.isSmoker}`;
  }

  private eqRegion(user: User): string {
    return `user.region = '${user.region}'`;
  }

  private neSelf(user: User): string {
    return `user.id != ${user.user_id}`;
  }

  private eqActivityTime(user: User): string {
    return `user.activityTime = '${user.activityTime}'`;
  }

  private userInSubQuery(subQuery: SelectQueryBuilder<User>): string {
    return `user.id IN (${subQuery.getQuery()})`;
  }
}
