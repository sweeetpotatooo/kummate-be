export const handleError = (error: Error): void => {
  // 로그 서비스에 에러 기록
  console.error('Error occurred:', error.message);
};
