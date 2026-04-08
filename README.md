## Student
- Name: Олексій Войчук
- Group: 232/1

## Практичне заняття №3 — CRUD REST API для MiniShop

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### ⚙️ Структура репозиторію
```text
.
├── src/
│   ├── categories/       # Модуль категорій (Entity, Service, Controller)
│   ├── products/         # Модуль продуктів (Entity, Service, Controller)
│   ├── migrations/       # SQL міграції бази даних
│   ├── data-source.ts    # Конфігурація TypeORM
│   └── app.module.ts     # Головний модуль
├── Dockerfile
├── docker-compose.yml
└── README.md

### 🚀 Запуск проекту
```bash
cp .env.example .env
docker compose up --build -d

Результати тестування API (CURL / PowerShell)
1. Тест створення категорії:
id name        description         createdAt
-- ----        -----------         ---------
 1 Electronics Gadgets and devices 2026-04-08T17:42:10.342Z

2. Тест створення продукту:

id          : 1
name        : iPhone 15
description :
price       : 999,99
stock       : 50
isActive    : True
category    : @{id=1}
createdAt   : 2026-04-08T17:42:27.646Z
updatedAt   : 2026-04-08T17:42:27.646Z

3. Тест отримання всіх продуктів:

id          : 1
name        : iPhone 15
description :
price       : 999.99
stock       : 50
isActive    : True
category    : @{id=1; name=Electronics; description=Gadgets and devices; createdAt=2026-04-08T17:42:10.342Z}
createdAt   : 2026-04-08T17:42:27.646Z
updatedAt   : 2026-04-08T17:42:27.646Z



name        : iPhone 15
description :
price       : 999.99
stock       : 50
isActive    : True
category    : @{id=1; name=Electronics; description=Gadgets and devices; createdAt=2026-04-08T17:42:10.342Z}
createdAt   : 2026-04-08T17:42:27.646Z
updatedAt   : 2026-04-08T17:42:27.646Z



stock       : 50
isActive    : True
category    : @{id=1; name=Electronics; description=Gadgets and devices; createdAt=2026-04-08T17:42:10.342Z}
createdAt   : 2026-04-08T17:42:27.646Z
updatedAt   : 2026-04-08T17:42:27.646Z



category    : @{id=1; name=Electronics; description=Gadgets and devices; createdAt=2026-04-08T17:42:10.342Z}
createdAt   : 2026-04-08T17:42:27.646Z
updatedAt   : 2026-04-08T17:42:27.646Z



updatedAt   : 2026-04-08T17:42:27.646Z
