import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthService } from '../../auth/auth.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authService: AuthService, // AuthService 주입
  ) {}

  @Post()
  async create(
    @Headers('Authorization') token: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // 토큰에서 사용자 정보를 검증하고 추출
    const decodedToken = await this.authService.validateToken(
      token.replace('Bearer ', ''),
    );
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    // 사용자 ID를 이용하여 게시글 생성
    return this.postService.create(createPostDto, decodedToken.userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
