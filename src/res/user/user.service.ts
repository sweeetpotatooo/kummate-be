import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from '../login/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { user_id, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { user_id } });

    // Here, we compare the plain text password for simplicity, but in a real application, you should use hashed passwords.
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
  async findOne(user_id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { user_id },
    });
    return user || null;
  }
  async getUserMainPage(): Promise<string> {
    return 'User Main Page';
  }

  async findUserById(user_id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { user_id } });
    if (!user) {
      return null;
    }
    return user;
  }
  async updateUser(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
}
