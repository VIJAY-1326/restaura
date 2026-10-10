import pool from '../config/db.js';

export async function getWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(`
      SELECT
        w.id as wishlist_id,
        w.created_at as added_at,
        f.*,
        c.name as category_name,
        c.slug as category_slug
      FROM wishlist_items w
      JOIN foods f ON w.food_id = f.id
      JOIN categories c ON f.category_id = c.id
      WHERE w.user_id = ?
      ORDER BY w.id DESC
    `, [userId]);

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

export async function toggleWishlist(req, res, next) {
  try {
    const { food_id } = req.body;
    const userId = req.user.id;

    if (!food_id) {
      return res.status(400).json({ success: false, message: 'food_id is required' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM wishlist_items WHERE user_id = ? AND food_id = ?',
      [userId, food_id]
    );

    let isWishlisted = false;

    if (existing.length > 0) {
      await pool.query('DELETE FROM wishlist_items WHERE id = ?', [existing[0].id]);
      isWishlisted = false;
    } else {
      await pool.query('INSERT INTO wishlist_items (user_id, food_id) VALUES (?, ?)', [userId, food_id]);
      isWishlisted = true;
    }

    const [allIds] = await pool.query('SELECT food_id FROM wishlist_items WHERE user_id = ?', [userId]);
    const wishlistFoodIds = [];
    allIds.forEach((item) => {
      wishlistFoodIds.push(item.food_id);
    });

    res.json({
      success: true,
      message: isWishlisted ? 'Dish saved to wishlist' : 'Dish removed from wishlist',
      isWishlisted,
      wishlistFoodIds
    });
  } catch (error) {
    next(error);
  }
}

export async function getWishlistIds(req, res, next) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT food_id FROM wishlist_items WHERE user_id = ?', [userId]);
    const ids = [];
    rows.forEach((row) => {
      ids.push(row.food_id);
    });
    res.json({ success: true, data: ids });
  } catch (error) {
    next(error);
  }
}
