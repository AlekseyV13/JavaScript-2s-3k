import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ds = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'nestuser',
    password: process.env.POSTGRES_PASSWORD || 'nestpassword',
    database: process.env.POSTGRES_DB || 'nestdb',
});

async function seed() {
    console.log('Підключення до бази даних...');
    await ds.initialize();
    console.log('Підключено! Починаємо наповнення...');

    const categories = ['Електроніка', 'Аксесуари', 'Одяг'];
    for (const catName of categories) {
        await ds.query(
            `INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING`,
            [catName],
        );
    }
    console.log('✅ Категорії додано.');

    const baseProducts = [
        { name: 'iPhone 16', price: 999, stock: 50, categoryId: 1 },
        { name: 'Galaxy S24', price: 849, stock: 40, categoryId: 1 },
        { name: 'MacBook Pro', price: 2499, stock: 15, categoryId: 1 },
        { name: 'iPad Air', price: 599, stock: 30, categoryId: 1 },
        { name: 'AirPods Pro', price: 249, stock: 100, categoryId: 2 },
        { name: 'USB-C Cable', price: 19, stock: 500, categoryId: 2 },
        { name: 'MagSafe Charger', price: 39, stock: 80, categoryId: 2 },
        { name: 'Laptop Sleeve', price: 49, stock: 60, categoryId: 2 },
        { name: 'T-Shirt Dev', price: 25, stock: 200, categoryId: 3 },
        { name: 'Hoodie NestJS', price: 55, stock: 75, categoryId: 3 },
    ];

    for (let i = 0; i < 3; i++) {
        for (const p of baseProducts) {
            const suffix = i > 0 ? ` v${i + 1}` : '';

            await ds.query(
                `INSERT INTO products (name, price, stock, category_id) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT DO NOTHING`,
                [`${p.name}${suffix}`, p.price + i * 10, p.stock, p.categoryId],
            );
        }
    }

    console.log('✅ Seed завершено: 3 категорії, 30 продуктів успішно додані в базу!');
    await ds.destroy();
}

seed().catch((error) => {
    console.error('❌ Помилка під час виконання seed:', error);
});