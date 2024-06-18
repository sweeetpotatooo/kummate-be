import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { SignUpRequestForm } from './dto/sign-up-request-form.dto';

@ApiTags('Sign Controller 로그인 API')
@Controller('api/users/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @ApiOperation({
    summary: '사용자 회원가입',
    description: '사용자에게 입력을 받고 회원가입 합니다.',
  })
  @Post()
  async signUp(@Body() form: SignUpRequestForm) {
    await this.registerService.signUp(form);
    return {
      code: 'RESPONSE_CREATED',
      data: null,
    };
  }
}
