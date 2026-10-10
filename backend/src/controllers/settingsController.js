import pool from '../config/db.js';

export async function getSettings(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM restaurant_settings LIMIT 1');
    if (rows.length === 0) {
      return res.json({
        success: true,
        data: {
          restaurant_name: 'Restaura',
          tagline: 'Elevated Culinary Artistry & Gourmet Dining',
          phone: '+1 (555) 234-5678',
          email: 'concierge@restaura.com',
          address: '450 Epicurean Way, Gourmet District, San Francisco, CA 94107',
          opening_hours: 'Mon-Sun: 11:00 AM - 11:00 PM',
          tax_rate_percent: 8.50,
          delivery_fee: 4.99,
          free_delivery_threshold: 50.00,
          announcement_banner: 'Complimentary artisan dessert on orders above $60 this weekend!',
          is_ordering_enabled: 1
        }
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const {
      restaurant_name,
      tagline,
      phone,
      email,
      address,
      opening_hours,
      tax_rate_percent,
      delivery_fee,
      free_delivery_threshold,
      announcement_banner,
      is_ordering_enabled
    } = req.body;

    const [rows] = await pool.query('SELECT id FROM restaurant_settings LIMIT 1');

    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO restaurant_settings (
          restaurant_name, tagline, phone, email, address, opening_hours,
          tax_rate_percent, delivery_fee, free_delivery_threshold, announcement_banner, is_ordering_enabled
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        restaurant_name || 'Restaura',
        tagline || '',
        phone || '',
        email || '',
        address || '',
        opening_hours || '',
        tax_rate_percent !== undefined ? Number(tax_rate_percent) : 8.5,
        delivery_fee !== undefined ? Number(delivery_fee) : 4.99,
        free_delivery_threshold !== undefined ? Number(free_delivery_threshold) : 50.00,
        announcement_banner || '',
        is_ordering_enabled !== undefined ? (is_ordering_enabled ? 1 : 0) : 1
      ]);
    } else {
      await pool.query(`
        UPDATE restaurant_settings SET
          restaurant_name = COALESCE(?, restaurant_name),
          tagline = COALESCE(?, tagline),
          phone = COALESCE(?, phone),
          email = COALESCE(?, email),
          address = COALESCE(?, address),
          opening_hours = COALESCE(?, opening_hours),
          tax_rate_percent = COALESCE(?, tax_rate_percent),
          delivery_fee = COALESCE(?, delivery_fee),
          free_delivery_threshold = COALESCE(?, free_delivery_threshold),
          announcement_banner = COALESCE(?, announcement_banner),
          is_ordering_enabled = COALESCE(?, is_ordering_enabled)
        WHERE id = ?
      `, [
        restaurant_name || null,
        tagline !== undefined ? tagline : null,
        phone || null,
        email || null,
        address || null,
        opening_hours || null,
        tax_rate_percent !== undefined ? Number(tax_rate_percent) : null,
        delivery_fee !== undefined ? Number(delivery_fee) : null,
        free_delivery_threshold !== undefined ? Number(free_delivery_threshold) : null,
        announcement_banner !== undefined ? announcement_banner : null,
        is_ordering_enabled !== undefined ? (is_ordering_enabled ? 1 : 0) : null,
        rows[0].id
      ]);
    }

    const [updated] = await pool.query('SELECT * FROM restaurant_settings LIMIT 1');
    res.json({ success: true, message: 'Restaurant settings updated', data: updated[0] });
  } catch (error) {
    next(error);
  }
}
