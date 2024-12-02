# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# 모든 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm install --only=production

# 빌드 결과물 및 필요한 파일 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 포트 설정
EXPOSE 8080

# 애플리케이션 시작
CMD ["node", "dist/main.js"]
