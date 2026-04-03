# Quản Lý Công Việc (Work Management System)

Dự án Quản Lý Công Việc (Work Management System) là một ứng dụng Fullstack giúp theo dõi, quản lý tiến độ công việc và nhiệm vụ. Ứng dụng cung cấp các tính năng quản lý với giao diện trực quan, hỗ trợ kéo thả (drag and drop) kiểu bảng Kanban và cập nhật dữ liệu theo thời gian thực (real-time).

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### **Backend (Spring Boot)**
- **Ngôn ngữ:** Java 21
- **Framework:** Spring Boot 3.5.11
- **Cơ sở dữ liệu:** MongoDB
- **Bảo mật:** Spring Security & JWT (JSON Web Tokens)
- **Real-time:** Spring Boot WebSocket
- **Tài liệu API:** Springdoc OpenAPI (Swagger UI)
- **Khác:** Lombok, Spring Boot Validation

### **Frontend (Vite + React)**
- **Framework:** React 19 chạy trên Vite
- **Styling:** Tailwind CSS v4, Framer Motion (cho animations), clsx, tailwind-merge
- **Quản lý State & Call API:** React Query (@tanstack/react-query), Axios
- **Routing:** React Router DOM
- **UI Components & Icons:** Recharts (vẽ biểu đồ), Lucide React (icons)
- **Tính năng kéo thả (Drag & Drop):** @hello-pangea/dnd

---

## 📂 Cấu Trúc Dự Án

- `Backend/`: Chứa mã nguồn Backend (Spring Boot + Java + MongoDB).
- `Frontend/`: Chứa mã nguồn Frontend (ReactJS + Vite).

---

## 🛠 Hướng Dẫn Cài Đặt Và Chạy (Setup & Run)

### 1. Khởi chạy Backend
1. Đảm bảo bạn đã cài đặt **Java 21**, **Maven** và **MongoDB**.
2. Mở terminal và di chuyển vào thư mục `Backend`:
   ```bash
   cd Backend
   ```
3. Chạy dự án Spring Boot:
   ```bash
   mvn spring-boot:run
   ```
4. *API Docs sẽ có sẵn tại http://localhost:8080/swagger-ui.html (hoặc theo cấu hình cổng của bạn).*

### 2. Khởi chạy Frontend
1. Đảm bảo bạn đã cài đặt **Node.js**.
2. Mở terminal mới và di chuyển vào thư mục `Frontend`:
   ```bash
   cd Frontend
   ```
3. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
4. Khởi chạy server phát triển (Development server):
   ```bash
   npm run dev
   ```
5. Truy cập ứng dụng qua đường dẫn được Vite cung cấp (thường là `http://localhost:5173`).
