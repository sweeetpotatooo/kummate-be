// src/favorites/entities/favorite.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Article } from '../../article/entities/article.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // 데이터베이스 컬럼명 명시
  user: User;

  @ManyToOne(() => Article, (article) => article.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' }) // 데이터베이스 컬럼명 명시
  article: Article;

  @CreateDateColumn({ name: 'created_at' }) // 컬럼명 명시
  created_at: Date;
}
