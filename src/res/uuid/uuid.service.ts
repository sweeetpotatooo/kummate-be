// utils.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'; // uuid 모듈에서 v4 버전 import

@Injectable()
export class UUIDService {
  getUUID(): string {
    return uuidv4(); // v4 UUID 생성
  }
}
