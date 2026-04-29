# TaskFlow — Task Manager

[![Build Status](http://YOUR_JENKINS_URL/buildStatus/icon?job=task-manager)](http://YOUR_JENKINS_URL/job/task-manager)
[![Quality Gate](https://YOUR_SONARQUBE_URL/api/project_badges/measure?project=task-manager&metric=alert_status)](https://YOUR_SONARQUBE_URL/dashboard?id=task-manager)
[![Coverage](https://YOUR_SONARQUBE_URL/api/project_badges/measure?project=task-manager&metric=coverage)](https://YOUR_SONARQUBE_URL/dashboard?id=task-manager)

> Web app manajemen tugas sederhana berbasis Node.js + Express, dilengkapi dengan CI/CD pipeline Jenkins & SonarQube.

---

## 🚀 Run App

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production
npm start
```

Akses di: `http://localhost:3000`

## 🧪 Run Tests

```bash
npm test
```

---

## 📡 API Documentation

### Base URL: `/api/tasks`

| Method | Endpoint          | Deskripsi                        |
|--------|-------------------|----------------------------------|
| GET    | `/api/tasks`      | Get semua task (bisa filter)     |
| GET    | `/api/tasks/stats`| Get statistik task               |
| GET    | `/api/tasks/:id`  | Get task by ID                   |
| POST   | `/api/tasks`      | Buat task baru                   |
| PUT    | `/api/tasks/:id`  | Update task                      |
| DELETE | `/api/tasks/:id`  | Hapus task                       |
| GET    | `/health`         | Health check                     |

### Query Parameters (GET /api/tasks)

| Param      | Values                      |
|------------|-----------------------------|
| `status`   | `pending`, `in-progress`, `done` |
| `priority` | `low`, `medium`, `high`     |

### Request Body (POST /api/tasks)

```json
{
  "title": "Setup Jenkins",
  "description": "Install and configure Jenkins with Docker",
  "priority": "high"
}
```

### Request Body (PUT /api/tasks/:id)

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "status": "in-progress"
}
```

---

## 🔧 Tools

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Testing**: Jest + Supertest
- **CI/CD**: Jenkins
- **Code Quality**: SonarQube