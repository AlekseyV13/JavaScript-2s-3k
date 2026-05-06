## Student
- Name: Олексій Войчук
- Group: <Вкажи свою групу тут>

## Практичне заняття №5 — JWT Authentication + Guards + RBAC

### Структура репозиторію
.
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── users/
│   │   ├── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── common/
│   │   ├── enums/
│   │   │   └── role.enum.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   ├── categories/
│   ├── products/
│   ├── orders/
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
API EndpointsMethodURLAuthRole
POST/auth/register--
POST/auth/login--
GET/api/categories--
POST/api/categories JWT admin
GET/api/products--
POST/api/products JWT admin
PATCH/api/products/:id JWT admin
DELETE/api/products/:id JWT admin
POST/api/orders JWT user/admin

Тест реєстрації
JSON
{
  "id": 1,
  "email": "oleksii3@test.com",
  "name": "Oleksii3",
  "role": "user",
  "createdAt": "2026-05-06T10:30:00.000Z"
}

Тест логіну
JSON
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Тест 401 — запит без токена (Unauthorized)
JSON
{
  "message": "Unauthorized",
  "statusCode": 401
}

Тест 403 — запит з роллю user (Forbidden)
JSON
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}

Тест успішного створення продукту від admin (201 Created)
JSON
{
  "id": 4,
  "title": "Свічки запалювання Lancer X",
  "price": 1200,
  "stock": 0,
  "image": null,
  "category": {
    "id": 1 }
}

Тест успішного створення замовлення (201 Created)
JSON
{
  "id": 2,
  "createdAt": "2026-05-06T10:42:11.254Z",
  "status": "pending",
  "user": {
    "id": 1,
    "email": "oleksii3@test.com",
    "role": "admin"
  },
  "items": [
    {
      "id": 1,
      "title": "Масляний фільтр",
      "price": "350.00"
    },
    {
      "id": 2,
      "title": "Масляний фільтр",
      "price": "350.00"
    }
  ]
}

