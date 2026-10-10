import pool from '../config/db.js';

export async function createOrder(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const {
      address_id,
      recipient_name,
      recipient_phone,
      delivery_address,
      delivery_instructions,
      payment_method = 'COD'
    } = req.body;

    const [cartItems] = await connection.query(`
      SELECT
        ci.food_id,
        ci.quantity,
        f.name as food_name,
        f.price,
        f.image_url,
        f.is_available
      FROM cart_items ci
      JOIN foods f ON ci.food_id = f.id
      WHERE ci.user_id = ?
    `, [userId]);

    if (cartItems.length === 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Your bag is empty' });
    }

    let unavailableCount = 0;
    cartItems.forEach((item) => {
      if (!item.is_available) unavailableCount++;
    });

    if (unavailableCount > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Some items in your bag are currently unavailable. Please review your bag.'
      });
    }

    let finalName = recipient_name;
    let finalPhone = recipient_phone;
    let finalAddress = delivery_address;

    if (address_id) {
      const [addrRows] = await connection.query(
        'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
        [address_id, userId]
      );
      if (addrRows.length > 0) {
        const addr = addrRows[0];
        finalName = addr.recipient_name;
        finalPhone = addr.phone;
        finalAddress = `${addr.street_address}${addr.landmark ? ', ' + addr.landmark : ''}, ${addr.city}, ${addr.state} ${addr.postal_code}`;
      }
    }

    if (!finalName || !finalPhone || !finalAddress) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Delivery address and contact information are required'
      });
    }

    const [settingsRows] = await connection.query('SELECT tax_rate_percent, delivery_fee, free_delivery_threshold, is_ordering_enabled FROM restaurant_settings LIMIT 1');
    const settings = settingsRows[0] || { tax_rate_percent: 8.5, delivery_fee: 4.99, free_delivery_threshold: 50, is_ordering_enabled: 1 };

    if (!settings.is_ordering_enabled) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Online ordering is temporarily paused by the restaurant' });
    }

    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += Number(item.price) * Number(item.quantity);
    });

    const tax = Number((subtotal * (Number(settings.tax_rate_percent) / 100)).toFixed(2));
    const deliveryFee = subtotal >= Number(settings.free_delivery_threshold) ? 0 : Number(settings.delivery_fee);
    const discount = 0.00;
    const totalAmount = Number((subtotal + tax + deliveryFee - discount).toFixed(2));

    const orderNumber = `RES-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

    const isOnline = payment_method === 'ONLINE';
    const paymentStatus = isOnline ? 'PAID' : 'PENDING';
    const transactionId = isOnline ? `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}` : null;

    await connection.beginTransaction();

    const [orderResult] = await connection.query(`
      INSERT INTO orders (
        order_number, user_id, address_id, recipient_name, recipient_phone,
        delivery_address, delivery_instructions, subtotal, tax, delivery_fee,
        discount, total_amount, status, payment_method, payment_status, transaction_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderNumber,
      userId,
      address_id || null,
      finalName,
      finalPhone,
      finalAddress,
      delivery_instructions || null,
      subtotal,
      tax,
      deliveryFee,
      discount,
      totalAmount,
      'PLACED',
      payment_method,
      paymentStatus,
      transactionId
    ]);

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      const lineTotal = Number((Number(item.price) * Number(item.quantity)).toFixed(2));
      await connection.query(`
        INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity, total_price, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        orderId,
        item.food_id,
        item.food_name,
        item.price,
        item.quantity,
        lineTotal,
        item.image_url
      ]);
    }

    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await connection.commit();
    connection.release();

    const [createdOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [createdItems] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        ...createdOrder[0],
        items: createdItems
      }
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
}

export async function getUserOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );

    const fullOrders = [];

    for (const order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      fullOrders.push({
        ...order,
        items
      });
    }

    res.json({ success: true, data: fullOrders });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let query = 'SELECT * FROM orders WHERE (id = ? OR order_number = ?)';
    const params = [id, id];

    if (!isAdmin) {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const [orders] = await pool.query(query, params);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    res.json({
      success: true,
      data: {
        ...order,
        items
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let query = 'SELECT * FROM orders WHERE id = ?';
    const params = [id];

    if (!isAdmin) {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const [orders] = await pool.query(query, params);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    if (order.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    if (!isAdmin && !['PLACED', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled once preparation has begun'
      });
    }

    await pool.query(
      'UPDATE orders SET status = ?, cancel_reason = ? WHERE id = ?',
      ['CANCELLED', reason || 'Cancelled by customer', order.id]
    );

    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [order.id]);
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        ...updated[0],
        items
      }
    });
  } catch (error) {
    next(error);
  }
}
