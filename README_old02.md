## Student
- Name: Олексій Войчук
- Group: 232/1

## Практичне заняття №2 — NestJS + PostgreSQL + Redis

## Структура репозиторію
.
├── src/             
├── Dockerfile
├── docker-compose.yml
├── .env.example      
└── README.md

Перевірка сервісів

SERVICE    CREATED             STATUS                    PORTS
javascript-2s-3k-app-1        javascript-2s-3k-app   "docker-entrypoint.s…"   app        7 minutes ago       Up 21 seconds             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
javascript-2s-3k-postgres-1   postgres:16-alpine     "docker-entrypoint.s…"   postgres   About an hour ago   Up 27 seconds (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
javascript-2s-3k-redis-1      redis:7-alpine         "docker-entrypoint.s…"   redis      About an hour ago


Перевірка PostgreSQL

                                                      List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------
 nestdb    | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
 postgres  | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
 template0 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            
|            |           | nestuser=CTc/nestuser
 template1 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            
|            |           | nestuser=CTc/nestuser
(4 rows) 


Перевірка Redis

PONG

Перевірка застосунку

Hello World!

Логи NestJS (фрагмент)

[Nest] 29  - 04/01/2026, 6:58:31 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +278ms
[Nest] 29  - 04/01/2026, 6:58:31 PM     LOG [RoutesResolver] AppController {/}: +13ms
[Nest] 29  - 04/01/2026, 6:58:31 PM     LOG [RouterExplorer] Mapped {/, GET} route +8ms
[Nest] 29  - 04/01/2026, 6:58:31 PM     LOG [NestApplication] Nest application successfully started +6ms



 SERVICE    CREATED             STATUS                   PORTS
javascript-2s-3k-app-1        javascript-2s-3k-app   "docker-entrypoint.s…"   app        10 minutes ago      Up 4 minutes             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
javascript-2s-3k-postgres-1   postgres:16-alpine     "docker-entrypoint.s…"   postgres   About an hour ago   Up 4 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
javascript-2s-3k-redis-1      redis:7-alpine         "docker-entrypoint.s…"   redis      About an hour ago   Up 4 minutes (healthy)   0.0.0.0:6379->6379/tcp, [::]

:6379->6379/tcp