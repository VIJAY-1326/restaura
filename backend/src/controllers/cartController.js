import pool from '../config/db.js';

async function calculateCartSummary(userId) {
  const [items] = await pool.query(`
    SELECT
      ci.id,
      ci.food_id,
      ci.quantity,
      f.name as food_name,
      f.price,
      f.original_price,
      f.image_url,
      f.is_available,
      f.dietary,
      (f.price * ci.quantity) as line_total
    FROM cart_items ci
    JOIN foods f ON ci.food_id = f.id
    WHERE ci.user_id = ?
    ORDER BY ci.id DESC
  `, [userId]);

  const [settingsRows] = await pool.query('SELECT tax_rate_percent, delivery_fee, free_delivery_threshold FROM restaurant_settings LIMIT 1');
  const settings = settingsRows[0] || { tax_rate_percent: 8.5, delivery_fee: 4.99, free_delivery_threshold: 50 };

  let subtotal = 0;
  let totalItemsCount = 0;

  items.forEach((item) => {
    subtotal += Number(item.line_total);
    totalItemsCount += Number(item.quantity);
  });

  const tax = Number((subtotal * (Number(settings.tax_rate_percent) / 100)).toFixed(2));
  const deliveryFee = subtotal >= Number(settings.free_delivery_threshold) || subtotal === 0 ? 0 : Number(settings.delivery_fee);
  const totalAmount = Number((subtotal + tax + deliveryFee).toFixed(2));

  return {
    items,
    totalItemsCount,
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    deliveryFee,
    freeDeliveryThreshold: Number(settings.free_delivery_threshold),
    totalAmount
  };
}

export async function getCart(req, res, next) {
  try {
    const summary = await calculateCartSummary(req.user.id);
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { food_id, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!food_id) {
      return res.status(400).json({ success: false, message: 'food_id is required' });
    }

    const [foodRows] = await pool.query('SELECT id, is_available FROM foods WHERE id = ?', [food_id]);
    if (foodRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    if (!foodRows[0].is_available) {
      return res.status(400).json({ success: false, message: 'This item is currently sold out or unavailable' });
    }

    const qty = Math.max(1, parseInt(quantity, 10));

    await pool.query(`
      INSERT INTO cart_items (user_id, food_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [userId, food_id, qty]);

    const summary = await calculateCartSummary(userId);
    res.json({ success: true, message: 'Item added to bag', data: summary });
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity === undefined || isNaN(quantity)) {
      return res.status(400).json({ success: false, message: 'Valid quantity is required' });
    }

    const newQty = parseInt(quantity, 10);

    if (newQty <= 0) {
      await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId]);
    } else {
      await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [newQty, id, userId]);
    }

    const summary = await calculateCartSummary(userId);
    res.json({ success: true, message: 'Bag updated', data: summary });
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId]);

    const summary = await calculateCartSummary(userId);
    res.json({ success: true, message: 'Item removed from bag', data: summary });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    const userId = req.user.id;
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    const summary = await calculateCartSummary(userId);
    res.json({ success: true, message: 'Bag cleared', data: summary });
  } catch (error) {
    next(error);
  }
}
