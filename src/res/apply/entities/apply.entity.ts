import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApproveStatus } from '../../types/ApproveStatus.enum';
import { User } from '../../user/entities/user.entity';
import { Article } from '../../article/entities/article.entity';

@Entity()
export class Apply {
  @PrimaryGeneratedColumn()
  apply_id: number;

  @Column({
    type: 'enum',
    enum: ApproveStatus,
    default: ApproveStatus.WAIT,
  })
  approveStatus: ApproveStatus;

  @Column({ default: false })
  isApplicantDelete: boolean;

  @Column({ default: false })
  isArticleUserDelete: boolean;

  @Column({ default: false })
  isApplicantRead: boolean;

  @Column({ default: false })
  isArticleUserRead: boolean;

  @ManyToOne(() => User, (user) => user.applies)
  @JoinColumn({ name: 'applicant_user_id' })
  applicantUser: User;

  @ManyToOne(() => Article, (article) => article.applies)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @CreateDateColumn({ name: 'create_date_time' })
  createDate: Date;

  @UpdateDateColumn({ name: 'modified_date_time' })
  lastModifiedDate: Date;
}
