// src/favorites/dto/favorite-article.dto.ts

import { Article } from 'src/res/article/entities/article.entity';
import { AgeGroup } from 'src/res/types/ageGroup.enum';
import { Dorm } from 'src/res/types/dorm.enum';

export class FavoriteArticleDto {
  id: number;
  userId: number;
  title: string;
  content: string;
  nickname: string;
  gender: string;
  createDate: Date;
  region: Dorm;
  ageGroup: AgeGroup;
  smoke: boolean;
  isRecruiting: boolean;
  // 기타 필요한 필드들...

  constructor(article: Article) {
    this.id = article.article_id;
    this.userId = article.user.user_id;
    this.title = article.title;
    this.content = article.content;
    this.nickname = article.user.nickname;
    this.gender = article.user.gender;
    this.createDate = article.createDate; // Article 엔티티에 createDate 필드가 있다고 가정
    this.region = article.region;
    this.ageGroup = article.ageGroup;
    this.smoke = article.smoke;
    this.isRecruiting = article.isRecruiting;
  }
}
