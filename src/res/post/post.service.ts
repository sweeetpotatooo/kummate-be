import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { UserService } from '../user/user.service'; // UserService 임포트

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>, // TypeORM의 기본 Repository 사용
    private readonly userService: UserService, // UserService 주입
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    // 서버 측에서 작성자(author)를 설정
    const user = await this.userService.findOne(userId);
    console.log(createPostDto);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    createPostDto.author = user.username; // 작성자 필드를 설정

    const newPost = this.postRepository.create(createPostDto);
    return this.postRepository.save(newPost);
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto);
    return this.postRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
