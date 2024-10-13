import { Injectable } from '@nestjs/common';

// MBTI 타입 간의 궁합 점수를 저장한 배열
const mbtiScoreTable = [
  // INFP, ENFP, INFJ, ENFJ, INTJ, ENTJ, INTP, ENTP, ISFP, ESFP, ISTP, ESTP, ISFJ, ESFJ, ISTJ, ESTJ
  [-5, 3, 0, 5, 0, 0, 3, 0, -5, -3, -3, -5, 3, 3, 3, 0], // INFP
  [3, -5, 3, 0, 3, 5, 0, 3, 0, -3, 0, -5, 3, 5, 0, 0], // ENFP
  [0, 3, -5, 5, 5, 0, 5, 3, 3, -3, 0, -3, 5, 5, 3, 0], // INFJ
  [5, 0, 5, -5, 3, 0, 5, 0, 3, 0, 3, -3, 3, 3, 3, 5], // ENFJ
  [0, 3, 5, 3, -5, 5, 3, 0, 0, -3, 3, 0, 5, 3, 5, 3], // INTJ
  [0, 5, 0, 0, 5, -5, 3, 3, 0, 0, 0, 0, 5, 5, 5, 3], // ENTJ
  [3, 0, 5, 5, 3, 3, -5, 0, 3, 0, 3, 3, 5, 3, 3, 0], // INTP
  [0, 3, 3, 0, 0, 3, 0, -5, 0, 3, 0, 0, 3, 5, 0, 5], // ENTP
  [-5, 0, 3, 3, 0, 0, 3, 0, -5, 3, 5, 3, 0, 3, 5, 5], // ISFP
  [-3, -3, -3, 0, -3, 0, 0, 3, 3, -5, 3, 5, -3, 0, 3, 5], // ESFP
  [-3, 0, 0, 3, 3, 0, 3, 0, 5, 3, -5, 3, 3, 0, 5, 3], // ISTP
  [-5, -5, -3, -3, 0, 0, 3, 0, 3, 5, 3, -5, 3, 0, 3, 5], // ESTP
  [3, 3, 5, 3, 5, 5, 5, 3, 0, -3, 3, 3, -5, 0, 5, 5], // ISFJ
  [3, 5, 5, 3, 3, 5, 3, 5, 3, 0, 0, 0, 0, -5, 3, 5], // ESFJ
  [3, 0, 3, 3, 5, 5, 3, 0, 5, 3, 5, 3, 5, 3, -5, 3], // ISTJ
  [0, 0, 0, 5, 3, 3, 0, 5, 5, 5, 3, 5, 5, 5, 3, -5], // ESTJ
];

const mbtiTypes = [
  'INFP',
  'ENFP',
  'INFJ',
  'ENFJ',
  'INTJ',
  'ENTJ',
  'INTP',
  'ENTP',
  'ISFP',
  'ESFP',
  'ISTP',
  'ESTP',
  'ISFJ',
  'ESFJ',
  'ISTJ',
  'ESTJ',
];

@Injectable()
export class MbtiCompatibilityService {
  calculateCompatibility(type1: string, type2: string): number {
    const idx1 = mbtiTypes.indexOf(type1.toUpperCase());
    const idx2 = mbtiTypes.indexOf(type2.toUpperCase());

    if (idx1 === -1 || idx2 === -1) {
      throw new Error('Invalid MBTI type');
    }

    // 두 MBTI 유형 간의 점수를 반환합니다.
    return mbtiScoreTable[idx1][idx2];
  }
}
