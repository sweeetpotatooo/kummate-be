// board.module.ts
import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { UUIDModule } from '../uuid/uuid.module'; // UtilsModule import
import { AwsModule } from '../../upload/upload.module'; // AwsModule import

@Module({
  imports: [
    UUIDModule, // UUID 생성 및 기타 유틸리티 기능 제공
    AwsModule, // AWS S3와 관련된 기능 제공
  ],
  controllers: [BoardController], // BoardController 등록
  providers: [BoardService], // BoardService 등록
  exports: [BoardService], // 필요한 경우 BoardService를 외부 모듈에서 사용할 수 있도록 exports
})
export class BoardModule {}
