import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';

/**
 * 기본 엔터티 클래스(BaseEntity)
 * 생성 및 수정 날짜를 자동으로 관리하는 부모 클래스
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  /**
   * 엔터티 생성 날짜 (수정 불가)
   */
  @CreateDateColumn({ name: 'create_date_time' })
  createDate: Date;

  /**
   * 엔터티 마지막 수정 날짜
   */
  @UpdateDateColumn({ name: 'modified_date_time' })
  lastModifiedDate: Date;
}
