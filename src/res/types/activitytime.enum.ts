/**
 * 활동 시간(ActivityTime)에 대한 enum 정의
 * 각 값은 한국어 문자열로 매핑됨
 */
export enum ActivityTime {
  MIDNIGHT = '밤', // 자정 시간
  MORNING = '아침', // 아침 시간
  AFTERNOON = '오후', // 오후 시간
  EVENING = '저녁', // 저녁 시간
}

/**
 * ActivityTime 관련 유틸리티 함수들을 제공하는 클래스
 */
export class ActivityTimeUtils {
  /**
   * 주어진 문자열 값에 해당하는 ActivityTime enum 값을 반환
   * 유효하지 않은 값이 들어오면 예외를 발생시킴
   *
   * @param value - 매칭할 문자열 값 (예: '밤', '아침', '오후', '저녁')
   * @returns ActivityTime - 해당 문자열 값에 매칭되는 enum 값
   * @throws Error - 유효하지 않은 문자열 값이 들어올 경우 예외 발생
   */
  static fromValue(value: string): ActivityTime {
    // ActivityTime enum의 값들 중에서 주어진 문자열 값과 일치하는 것을 찾음
    const activityTime = Object.values(ActivityTime).find(
      (time) => time === value,
    );

    // 일치하는 값이 있으면 해당 enum 값 반환
    if (activityTime) {
      return activityTime as ActivityTime;
    }

    // 일치하는 값이 없으면 예외 발생
    throw new Error(`Invalid ActivityTime value: ${value}`);
  }
}
