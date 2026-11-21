# TOEIC Quest chạy bằng máy chủ dev của Vite (cần cho API lưu tiến độ và giáo viên AI).
FROM node:22-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Công tắc: coi kết nối từ mạng ảo của Docker là cục bộ (cổng chỉ được mở ở 127.0.0.1 của máy chủ).
ENV TOEIC_DOCKER=1
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
