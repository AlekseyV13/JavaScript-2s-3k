## Student
- Name: Олексій Войчук
- Group: 232/1

## Практичне заняття №7 — Redis + Pagination + Filtering

### Запуск проекту
```bash
cp .env.example .env
docker compose up --build -d
docker compose run --rm app npm run seed

Параметр,Тип,Default,Опис
page,number,1,Номер сторінки
pageSize,number,10,Елементів на сторінку (max 100)
sort,string,id,Поле сортування
order,asc/desc,desc,Напрямок
categoryId,number,-,Фільтр за категорією
minPrice,number,-,Мінімальна ціна
maxPrice,number,-,Максимальна ціна
search,string,-,Пошук за назвою (ILIKE)

Результати тестування
1. Тест пагінації та фільтрації (GET /api/products):
Виконано запит GET /api/products?search=Lancer&minPrice=100&maxPrice=5000&page=1&limit=10.
Система успішно прийняла параметри, застосувала QueryBuilder і повернула відповідь з TransformInterceptor. Структура meta (page, pageSize, total, totalPages) генерується коректно.

2. Тест наповнення бази (Seed):
Скрипт npm run seed успішно додає 3 категорії та 30 тестових товарів у базу даних PostgreSQL для тестування пагінації.

3. Тест кешування (Redis):
Команда docker compose exec redis redis-cli KEYS "products:*" підтвердила створення ключів кешу після GET-запитів. Інвалідація кешу налаштована у сервісі при зміні даних (POST/PATCH/DELETE).

