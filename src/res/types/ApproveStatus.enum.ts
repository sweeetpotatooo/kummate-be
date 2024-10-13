//src/res/types/ApproveStatus.enum.ts
/**
 * 승인 상태(ApproveStatus)에 대한 enum 정의
 * 각 값은 한국어 문자열로 매핑됨
 */
export enum ApproveStatus {
  WAIT = '대기', // 승인 대기 상태
  APPROVAL = '승인', // 승인 완료 상태
  REFUSE = '거절', // 승인 거절 상태
}

/**
 * ApproveStatus 관련 유틸리티 함수들을 제공하는 클래스
 */
export class ApproveStatusUtils {
  /**
   * 주어진 문자열 값에 해당하는 ApproveStatus enum 값을 반환
   * 유효하지 않은 값이 들어오면 예외를 발생시킴
   *
   * @param value - 매칭할 문자열 값 (예: '대기', '승인', '거절')
   * @returns ApproveStatus - 해당 문자열 값에 매칭되는 enum 값
   * @throws Error - 유효하지 않은 문자열 값이 들어올 경우 예외 발생
   */
  static fromValue(value: string): ApproveStatus {
    // ApproveStatus enum의 값들 중에서 주어진 문자열 값과 일치하는 것을 찾음
    const status = Object.values(ApproveStatus).find(
      (statusValue) => statusValue === value,
    );

    // 일치하는 값이 있으면 해당 enum 값 반환
    if (status) {
      return status as ApproveStatus;
    }

    // 일치하는 값이 없으면 예외 발생
    throw new Error(`Invalid ApproveStatus value: ${value}`);
  }
}
