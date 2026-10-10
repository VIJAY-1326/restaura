import pool from '../config/db.js';

export async function getDashboardStats(req, res, next) {
  try {
    const [totalRevenueRow] = await pool.query(
      'SELECT COALESCE(SUM(total_amount), 0) as totalRevenue FROM orders WHERE status != "CANCELLED"'
    );
    const totalRevenue = Number(totalRevenueRow[0].totalRevenue);

    const [todayRevenueRow] = await pool.query(
      'SELECT COALESCE(SUM(total_amount), 0) as todayRevenue FROM orders WHERE status != "CANCELLED" AND DATE(created_at) = CURDATE()'
    );
    const todayRevenue = Number(todayRevenueRow[0].todayRevenue);

    const [totalOrdersRow] = await pool.query('SELECT COUNT(*) as totalOrders FROM orders');
    const totalOrders = totalOrdersRow[0].totalOrders;

    const [activeOrdersRow] = await pool.query(
      'SELECT COUNT(*) as activeOrders FROM orders WHERE status NOT IN ("DELIVERED", "CANCELLED")'
    );
    const activeOrders = activeOrdersRow[0].activeOrders;

    const [totalCustomersRow] = await pool.query('SELECT COUNT(*) as totalCustomers FROM users WHERE role = "customer"');
    const totalCustomers = totalCustomersRow[0].totalCustomers;

    const [totalDishesRow] = await pool.query('SELECT COUNT(*) as totalDishes FROM foods');
    const totalDishes = totalDishesRow[0].totalDishes;

    const [statusDistributionRows] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    const statusMap = {
      PLACED: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      READY: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      CANCELLED: 0
    };

    statusDistributionRows.forEach((row) => {
      statusMap[row.status] = row.count;
    });

    const [popularDishes] = await pool.query(`
      SELECT
        oi.food_id,
        oi.food_name,
        oi.image_url,
        oi.unit_price,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'CANCELLED'
      GROUP BY oi.food_id, oi.food_name, oi.image_url, oi.unit_price
      ORDER BY total_sold DESC
      LIMIT 6
    `);

    const [recentOrdersRaw] = await pool.query(`
      SELECT
        o.*,
        u.email as customer_email,
        u.name as customer_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.id DESC
      LIMIT 8
    `);

    const recentOrders = [];
    for (const order of recentOrdersRaw) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      recentOrders.push({
        ...order,
        items
      });
    }

    const [revenueTimeline] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m-%d') as order_date,
        DATE_FORMAT(created_at, '%b %d') as formatted_date,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as order_count
      FROM orders
      WHERE status != 'CANCELLED' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d'), DATE_FORMAT(created_at, '%b %d')
      ORDER BY order_date ASC
    `);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          todayRevenue,
          totalOrders,
          activeOrders,
          totalCustomers,
          totalDishes
        },
        statusDistribution: statusMap,
        popularDishes,
        recentOrders,
        revenueTimeline
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrdersAdmin(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const conditions = [];
    const params = [];

    if (status && status !== 'ALL') {
      conditions.push('o.status = ?');
      params.push(status);
    }

    if (search && search.trim()) {
      conditions.push('(o.order_number LIKE ? OR o.recipient_name LIKE ? OR o.recipient_phone LIKE ?)');
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = ' WHERE ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) as total FROM orders o ${whereClause}`;
    const [countResult] = await pool.query(countQuery, params);
    const totalItems = countResult[0].total;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;

    const dataQuery = `
      SELECT o.*, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.id DESC
      LIMIT ? OFFSET ?
    `;

    const [orders] = await pool.query(dataQuery, [...params, limitNum, offset]);

    const detailedOrders = [];
    for (const order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      detailedOrders.push({
        ...order,
        items
      });
    }

    res.json({
      success: true,
      data: detailedOrders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, cancel_reason } = req.body;

    const validStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const currentStatus = existing[0].status;

    if (currentStatus === 'DELIVERED' && status !== 'DELIVERED') {
      return res.status(400).json({ success: false, message: 'Delivered orders cannot be transitioned to an earlier state' });
    }

    if (currentStatus === 'CANCELLED' && status !== 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Cancelled orders cannot be reopened' });
    }

    let paymentStatus = existing[0].payment_status;
    if (status === 'DELIVERED' && existing[0].payment_method === 'COD') {
      paymentStatus = 'PAID';
    }

    await pool.query(
      'UPDATE orders SET status = ?, cancel_reason = COALESCE(?, cancel_reason), payment_status = ? WHERE id = ?',
      [status, cancel_reason || null, paymentStatus, id]
    );

    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: {
        ...updated[0],
        items
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllCustomers(req, res, next) {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const conditions = ["role = 'customer'"];
    const params = [];

    if (search && search.trim()) {
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    const whereClause = ' WHERE ' + conditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const [countResult] = await pool.query(countQuery, params);
    const totalItems = countResult[0].total;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;

    const dataQuery = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.avatar,
        u.status,
        u.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(CASE WHEN o.status != 'CANCELLED' THEN o.total_amount ELSE 0 END), 0) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      ${whereClause}
      GROUP BY u.id, u.name, u.email, u.phone, u.avatar, u.status, u.created_at
      ORDER BY u.id DESC
      LIMIT ? OFFSET ?
    `;

    const [customers] = await pool.query(dataQuery, [...params, limitNum, offset]);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleCustomerStatus(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT status, role FROM users WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (rows[0].role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin account status cannot be altered here' });
    }

    const newStatus = rows[0].status === 'active' ? 'inactive' : 'active';
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);

    res.json({
      success: true,
      message: `Customer account has been set to ${newStatus}`,
      status: newStatus
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const [salesByCategory] = await pool.query(`
      SELECT
        c.name as category_name,
        COUNT(oi.id) as items_sold,
        COALESCE(SUM(oi.total_price), 0) as revenue
      FROM categories c
      JOIN foods f ON c.id = f.category_id
      JOIN order_items oi ON f.id = oi.food_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'CANCELLED'
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `);

    const [orderStatusSummary] = await pool.query(`
      SELECT status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_value
      FROM orders
      GROUP BY status
    `);

    const [dailySales] = await pool.query(`
      SELECT
        DATE(created_at) as sale_date,
        DATE_FORMAT(created_at, '%W, %b %d') as formatted_date,
        COUNT(*) as order_count,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE status != 'CANCELLED' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%W, %b %d')
      ORDER BY sale_date ASC
    `);

    const [avgOrderValRow] = await pool.query(`
      SELECT
        COALESCE(AVG(total_amount), 0) as avgOrderValue,
        MAX(total_amount) as maxOrderValue,
        MIN(total_amount) as minOrderValue
      FROM orders
      WHERE status != 'CANCELLED'
    `);

    res.json({
      success: true,
      data: {
        salesByCategory,
        orderStatusSummary,
        dailySales,
        metrics: {
          avgOrderValue: Number(Number(avgOrderValRow[0].avgOrderValue).toFixed(2)),
          maxOrderValue: Number(avgOrderValRow[0].maxOrderValue || 0),
          minOrderValue: Number(avgOrderValRow[0].minOrderValue || 0)
        }
      }
    });
  } catch (error) {
    next(error);
  }
}
