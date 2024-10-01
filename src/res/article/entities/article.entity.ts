import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Gender } from '../../types/gender.enum';
import { ageGroup } from '../../types/ageGroup.enum';
import { Dorm } from '../../types/dorm.enum';
import { BaseEntity } from 'src/res/entities/Base.entity';
import { Apply } from 'src/res/apply/entities/apply.entity';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  article_id: number;

  @ManyToOne(() => User, (user) => user.articles, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: Dorm,
  })
  region: Dorm;

  @Column({
    type: 'enum',
    enum: ageGroup,
  })
  ageGroup: ageGroup;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ name: 'smoke', type: 'boolean' })
  smoke: boolean;

  @Column({ name: 'is_recruit', type: 'boolean', default: true })
  isRecruiting: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => Apply, (apply) => apply.article)
  applies: Apply[];
}
