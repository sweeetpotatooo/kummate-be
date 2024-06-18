import { Injectable } from '@nestjs/common';
import { SignUpRequestForm } from './dto/sign-up-request-form.dto';
// 기타 필요한 import 추가

@Injectable()
export class RegisterService {
  constructor(
    // 필요한 repository 또는 다른 서비스 주입
  ) {}

  async signUp(form: SignUpRequestForm): Promise<void> {
    // 회원가입 로직 구현
    // 예를 들어, 사용자 정보 저장, 비밀번호 암호화, 이메일 중복 체크 등
  }
}
