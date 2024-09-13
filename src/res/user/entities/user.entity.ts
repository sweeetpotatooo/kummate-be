import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Login } from '../../login/entities/login.entity';
import { UserType } from 'src/res/types/usertype.enum';
import { MatchStatus } from 'src/res/types/MatchStatus.enum';
import { ActivityTime } from 'src/res/types/activitytime.enum';
import { Gender } from 'src/res/types/gender.enum';
import { Dorm } from 'src/res/types/dorm.enum';
import { Mbti } from 'src/res/types/mbti.enum';
import { Department } from 'src/res/types/department.enum';
import { BaseEntity } from 'src/res/entities/Base.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: false })
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Department })
  department: Department;

  @Column({ nullable: false })
  age: number;

  @Column({ type: 'number', nullable: true })
  student_id: string | null;

  @Column({ type: 'boolean', default: false })
  certified: boolean;

  @Column({ type: 'enum', enum: UserType })
  userType: UserType;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'enum', enum: MatchStatus })
  matchStatus: MatchStatus;

  @Column({ name: 'is_smoker', default: false })
  isSmoker: boolean;

  @Column({ type: 'enum', enum: ActivityTime, nullable: true })
  activityTime?: ActivityTime;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'enum', enum: Dorm, name: 'region' })
  region: Dorm;

  @Column({ type: 'enum', enum: Mbti })
  mbti: Mbti;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column({ nullable: true })
  detail?: string;

  @Column({ type: 'int', nullable: true })
  snoring: number | null;

  @Column({ type: 'int', nullable: true })
  bruxism: number | null;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Login, (login) => login.user)
  logins: Login[];

  // 액세스 토큰과 리프레시 토큰을 추가
  @Column({ nullable: true })
  accessToken: string | null;

  @Column({ nullable: true })
  refreshToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
