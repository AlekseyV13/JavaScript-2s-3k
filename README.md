## Student
- Name: Олексій Войчук
- Group: 232/1

## Практичне заняття №4 — DTO + class-validator + Pipes

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### ⚙️ Структура репозиторію
```text
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── common/
│   │   └── pipes/
│   │       └── trim.pipe.ts
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### 🚀 Запуск проекту
```bash
cp .env.example .env
docker compose up --build -d
```

---

### 🧪 Результати тестування валідації (class-validator)

### Тест валідації — порожнє ім'я категорії
```json
{
  "message": [
    "name must be longer than or equal to 2 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Тест валідації — від'ємна ціна продукту
```json
{
  "message": [
    "price must not be less than 0.01"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Тест TrimPipe (обрізання пробілів)
```json
{
  "id": 2,
  "name": "Accessories",
  "createdAt": "2026-04-26T18:30:00.000Z"
}
```
