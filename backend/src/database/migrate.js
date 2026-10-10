import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await connection.query(schemaSql);

    await connection.changeUser({ database: process.env.DB_NAME || 'restaurant_db' });

    const [settings] = await connection.query('SELECT id FROM restaurant_settings LIMIT 1');
    if (settings.length === 0) {
      await connection.query(`
        INSERT INTO restaurant_settings (
          restaurant_name, tagline, phone, email, address, opening_hours,
          tax_rate_percent, delivery_fee, free_delivery_threshold, announcement_banner, is_ordering_enabled
        ) VALUES (
          'Restaura',
          'Elevated Culinary Artistry & Gourmet Dining',
          '+1 (555) 234-5678',
          'concierge@restaura.com',
          '450 Epicurean Way, Gourmet District, San Francisco, CA 94107',
          'Mon-Sun: 11:00 AM - 11:00 PM',
          8.50,
          4.99,
          50.00,
          'Complimentary artisan dessert on orders above $60 this weekend!',
          1
        )
      `);
    }

    const [adminCheck] = await connection.query('SELECT id FROM users WHERE email = ?', ['admin@restaura.com']);
    if (adminCheck.length === 0) {
      const adminHash = await bcrypt.hash('Admin@12345', 10);
      await connection.query(`
        INSERT INTO users (name, email, password_hash, phone, role, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['Chef Laurent & Management', 'admin@restaura.com', adminHash, '+1 (555) 019-2834', 'admin', 'active']);
    }

    const [customerCheck] = await connection.query('SELECT id FROM users WHERE email = ?', ['customer@restaura.com']);
    if (customerCheck.length === 0) {
      const customerHash = await bcrypt.hash('Customer@12345', 10);
      await connection.query(`
        INSERT INTO users (name, email, password_hash, phone, role, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['Elena Rostova', 'customer@restaura.com', customerHash, '+1 (555) 876-5432', 'customer', 'active']);
    }

    process.stdout.write('Database migration completed successfully.\n');
  } catch (error) {
    process.stderr.write(`Migration failed: ${error.message}\n`);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
