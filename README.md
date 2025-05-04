# คู่มือเริ่มต้น

## 1. Clone โปรเจกต์

```bash
git clone <url-repo>
cd webboard-backend
```

## 2. ติดตั้ง dependencies

```bash
npm install
```

## 3. ตั้งค่าฐานข้อมูล (Database)
- ตรวจสอบไฟล์ `src/config/ormconfig.ts` ว่าตั้งค่าการเชื่อมต่อฐานข้อมูลถูกต้อง (เช่น host, port, username, password, database)
- สร้างฐานข้อมูลตามชื่อที่ตั้งไว้ใน config

## 4. รันโปรเจกต์

### โหมดพัฒนา (Development)
```bash
npm run start:dev
```

### โหมดปกติ (Production)
```bash
npm run start:prod
```

## 5. โครงสร้างโปรเจกต์
- `src/` : โค้ดหลักของ backend (NestJS)
  - `auth/` : ระบบล็อกอิน/สมัครสมาชิก
  - `posts/` : จัดการโพสต์
  - `comments/` : จัดการคอมเมนต์
  - `communities/` : จัดการ community
  - `search/` : ฟีเจอร์ค้นหา
  - `users/` : จัดการผู้ใช้

## 6. การทดสอบ API
- สามารถใช้ Postman หรือ curl ทดสอบ endpoint ต่าง ๆ ได้
- ตัวอย่างการสร้าง comment:

```bash
curl -X POST http://localhost:3001/comments \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{
    "commentDetail": "ข้อความคอมเมนต์",
    "postId": 1
  }'
```


## 7. ปัญหาที่พบบ่อย
- ถ้าเชื่อมต่อฐานข้อมูลไม่ได้ ให้เช็ค config และสิทธิ์ของ user ฐานข้อมูล
- ถ้า JWT ไม่ถูกต้อง ให้เช็ค secret ใน `src/auth/constants.ts`
- ถ้า API ตอบ 400/401 ให้เช็ค header และ body ที่ส่งไป

## 8. ข้อมูลเพิ่มเติม
- โค้ดนี้ใช้ [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- ถ้ามีปัญหา/ข้อสงสัย ติดต่อทีม dev หรือดูเอกสารในโฟลเดอร์นี้

## ตารางสรุป API Endpoint

| Endpoint | Header | Body | Response |
|----------|--------|------|----------|
| **POST /auth/signup** | Content-Type: application/json | `{ "username": string, "password": string }` | `{ "message": "Signup successful", "user": { ... } }` |
| **POST /auth/signin** | Content-Type: application/json | `{ "username": string, "password": string }` | `{ "access_token": string, "user": { ... } }` (cookie set) |
| **GET /posts** | (optional) Authorization: Bearer token | - | `[ { ...post } ]` (list of posts) |
| **GET /posts/:id** | - | - | `{ ...post }` |
| **POST /posts** | Content-Type: application/json<br>Authorization: Bearer token | `{ "title": string, "content": string, "communityId": number }` | `{ ...post }` |
| **PUT /posts/:id** | Content-Type: application/json<br>Authorization: Bearer token | `{ "title"?: string, "content"?: string, "communityId"?: number }` | `{ ...post }` |
| **DELETE /posts/:id** | Authorization: Bearer token | - | `{ "message": "Post deleted" }` |
| **GET /comments/:postId** | - | - | `[ { ...comment } ]` |
| **POST /comments** | Content-Type: application/json<br>Authorization: Bearer token | `{ "commentDetail": string, "postId": number }` | `{ ...comment }` |
| **GET /communities** | - | - | `[ { ...community } ]` |
| **POST /communities** | Content-Type: application/json<br>Authorization: Bearer token | `{ "name": string, "description": string }` | `{ ...community }` |
| **GET /search?query=...** | - | - | `[ { ...post } ]` |

**หมายเหตุ:**
- ทุก endpoint ที่ต้องการ auth ให้ส่ง header `Authorization: Bearer <token>`
- Response อาจมีโครงสร้างเพิ่มเติมตาม entity (ดูในโค้ดแต่ละ controller)
- สามารถดูรายละเอียด field เพิ่มเติมในแต่ละ entity หรือ controller ได้ในโฟลเดอร์ `src/`

---
