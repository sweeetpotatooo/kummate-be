import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/RefreshToken.entity';
import { RefreshTokenService } from './RefreshToken.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]), // RefreshToken 엔티티 등록
  ],
  providers: [RefreshTokenService], // 서비스 등록
  exports: [RefreshTokenService], // 외부 모듈에서 사용할 수 있도록 서비스 내보내기
})
export class RefreshTokenModule {}
