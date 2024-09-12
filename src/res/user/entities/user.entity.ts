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
import { RefreshToken } from '../../refresh-token/entities/RefreshToken.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  department: string;

  @Column({ nullable: false })
  age: number;

  @Column({ type: 'int', nullable: true })
  user_roles: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  student_id: string | null;

  @Column({ type: 'boolean', default: false })
  certified: boolean;

  @Column({ nullable: true })
  user_type: string | null;

  @Column({ nullable: true })
  image: string | null;

  @Column({ nullable: true })
  gender: string | null;

  @Column({ type: 'int', nullable: true })
  match_status: number | null;

  @UpdateDateColumn({ type: 'timestamp' })
  modified_date_time: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_date_time: Date;

  @Column({ type: 'boolean', nullable: true })
  smoke: boolean | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  mbti: string | null;

  @Column({ type: 'int', nullable: true })
  snoring: number | null;

  @Column({ type: 'int', nullable: true })
  bruxism: number | null;

  @Column({ type: 'text', nullable: true })
  detail: string | null;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Login, (login) => login.user)
  logins: Login[];

  // RefreshToken과의 다대일 관계 추가
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  atk: string | null;

  @Column({ nullable: true })
  rtk: string | null;
}
