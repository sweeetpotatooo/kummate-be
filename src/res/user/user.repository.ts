// src/repository/user.repository.ts
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable() // Use Injectable decorator if necessary
export class UserRepository extends Repository<User> {
  // Example custom method: findByEmail
  async findByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.tag', 'tag')
      .where('user.email = :email', { email })
      .getOne();
  }
}
