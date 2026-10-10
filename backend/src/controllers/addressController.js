import pool from '../config/db.js';

export async function getAddresses(req, res, next) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC',
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

export async function createAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { label, recipient_name, phone, street_address, landmark, city, state, postal_code, is_default } = req.body;

    const [existing] = await pool.query('SELECT COUNT(*) as count FROM addresses WHERE user_id = ?', [userId]);
    const shouldBeDefault = is_default || existing[0].count === 0;

    if (shouldBeDefault) {
      await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }

    const [result] = await pool.query(`
      INSERT INTO addresses (user_id, label, recipient_name, phone, street_address, landmark, city, state, postal_code, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      label ? label.trim() : 'Home',
      recipient_name.trim(),
      phone.trim(),
      street_address.trim(),
      landmark ? landmark.trim() : null,
      city.trim(),
      state.trim(),
      postal_code.trim(),
      shouldBeDefault ? 1 : 0
    ]);

    const [newAddress] = await pool.query('SELECT * FROM addresses WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Delivery address saved', data: newAddress[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { label, recipient_name, phone, street_address, landmark, city, state, postal_code, is_default } = req.body;

    const [existing] = await pool.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (is_default) {
      await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }

    await pool.query(`
      UPDATE addresses SET
        label = COALESCE(?, label),
        recipient_name = COALESCE(?, recipient_name),
        phone = COALESCE(?, phone),
        street_address = COALESCE(?, street_address),
        landmark = COALESCE(?, landmark),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        postal_code = COALESCE(?, postal_code),
        is_default = COALESCE(?, is_default)
      WHERE id = ? AND user_id = ?
    `, [
      label ? label.trim() : null,
      recipient_name ? recipient_name.trim() : null,
      phone ? phone.trim() : null,
      street_address ? street_address.trim() : null,
      landmark !== undefined ? (landmark ? landmark.trim() : null) : null,
      city ? city.trim() : null,
      state ? state.trim() : null,
      postal_code ? postal_code.trim() : null,
      is_default !== undefined ? (is_default ? 1 : 0) : null,
      id,
      userId
    ]);

    const [updated] = await pool.query('SELECT * FROM addresses WHERE id = ?', [id]);
    res.json({ success: true, message: 'Address updated', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

export async function setDefaultAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    await pool.query('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?', [id, userId]);

    res.json({ success: true, message: 'Primary delivery address set' });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [existing] = await pool.query('SELECT is_default FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);

    if (existing[0].is_default) {
      const [remaining] = await pool.query('SELECT id FROM addresses WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
      if (remaining.length > 0) {
        await pool.query('UPDATE addresses SET is_default = 1 WHERE id = ?', [remaining[0].id]);
      }
    }

    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
}
