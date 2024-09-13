/**
 * 사용자 역할(UserRole)에 대한 enum 정의
 * 일반 사용자와 관리자 역할을 구분
 */
export enum UserRole {
  USER_ROLE = 'USER_ROLE', // 일반 사용자 역할
  ADMIN = 'ADMIN', // 관리자 역할
}

/**
 * UserRole 관련 유틸리티 함수들을 제공하는 클래스
 */
export class UserRoleUtils {
  /**
   * 주어진 문자열 값에 해당하는 UserRole enum 값을 반환
   * 유효하지 않은 값이 들어오면 예외를 발생시킴
   *
   * @param value - 매칭할 문자열 값 (예: 'USER_ROLE', 'ADMIN')
   * @returns UserRole - 해당 문자열 값에 매칭되는 enum 값
   * @throws Error - 유효하지 않은 문자열 값이 들어올 경우 예외 발생
   */
  static fromValue(value: string): UserRole {
    // UserRole enum의 값들 중에서 주어진 문자열 값과 일치하는 것을 찾음
    const role = Object.values(UserRole).find(
      (roleValue) => roleValue === value,
    );

    // 일치하는 값이 있으면 해당 enum 값 반환
    if (role) {
      return role as UserRole;
    }

    // 일치하는 값이 없으면 예외 발생
    throw new Error(`Invalid UserRole value: ${value}`);
  }
}
