import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { MbtiCompatibilityService } from '../mbti/mbti-compatibility.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, MbtiCompatibilityService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule], // AuthService에서 사용할 수 있도록 exports 추가
})
export class UserModule {}
