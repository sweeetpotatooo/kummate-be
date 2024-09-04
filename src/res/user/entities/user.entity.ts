// src/res/user/entities/user.entity.ts
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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number; // 자동으로 1씩 증가하는 primary key

  @Column({ nullable: false })
  username: string; // NOT NULL

  @Column({ nullable: false, unique: true })
  email: string; // NOT NULL 및 UNIQUE

  @Column({ nullable: false })
  password: string; // NOT NULL

  @Column({ nullable: false })
  department: string; // NOT NULL

  @Column({ nullable: false })
  age: number; // NOT NULL

  @Column({ type: 'int', nullable: true })
  user_roles: number | null; // NULL 허용, 정수형

  @Column({ type: 'varchar', length: 20, nullable: true })
  student_id: string | null; // NULL 허용, 학생 ID

  @Column({ type: 'boolean', default: false })
  certified: boolean; // NULL 허용, 인증 여부

  @Column({ nullable: true })
  user_type: string | null; // NULL 허용

  @Column({ nullable: true })
  image: string | null; // NULL 허용

  @Column({ nullable: true })
  gender: string | null; // NULL 허용

  @Column({ type: 'int', nullable: true })
  match_status: number | null; // NULL 허용, 정수형

  @UpdateDateColumn({ type: 'timestamp' })
  modified_date_time: Date; // 수정 시 자동 업데이트

  @CreateDateColumn({ type: 'timestamp' })
  created_date_time: Date; // 생성 시 자동 설정

  @Column({ type: 'boolean', nullable: true })
  smoke: boolean | null; // NULL 허용, 흡연 여부

  @Column({ type: 'varchar', length: 4, nullable: true })
  mbti: string | null; // NULL 허용, MBTI (최대 4글자)

  @Column({ type: 'int', nullable: true })
  snoring: number | null; // NULL 허용, 코골이 정도 (정수형)

  @Column({ type: 'int', nullable: true })
  bruxism: number | null; // NULL 허용, 이갈이 정도 (정수형)

  @Column({ type: 'text', nullable: true })
  detail: string | null; // NULL 허용, 텍스트로 상세 정보

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Login, (login) => login.user)
  logins: Login[];

  @Column({ nullable: true })
  currentRefreshToken?: string;

  // Refresh Token 만료 시간을 저장할 필드
  @Column({ type: 'timestamp', nullable: true })
  currentRefreshTokenExp?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
