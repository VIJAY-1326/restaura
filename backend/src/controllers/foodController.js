import pool from '../config/db.js';

export async function getAllFoods(req, res, next) {
  try {
    const {
      search,
      category_id,
      category_slug,
      dietary,
      minPrice,
      maxPrice,
      featured,
      popular,
      sort,
      includeUnavailable,
      page = 1,
      limit = 12
    } = req.query;

    const conditions = [];
    const params = [];

    if (includeUnavailable !== 'true') {
      conditions.push('f.is_available = 1');
    }

    if (search && search.trim()) {
      conditions.push('(f.name LIKE ? OR f.description LIKE ?)');
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (category_id) {
      conditions.push('f.category_id = ?');
      params.push(category_id);
    }

    if (category_slug) {
      conditions.push('c.slug = ?');
      params.push(category_slug);
    }

    if (dietary && ['veg', 'non-veg', 'vegan'].includes(dietary)) {
      conditions.push('f.dietary = ?');
      params.push(dietary);
    }

    if (minPrice && !isNaN(minPrice)) {
      conditions.push('f.price >= ?');
      params.push(Number(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
      conditions.push('f.price <= ?');
      params.push(Number(maxPrice));
    }

    if (featured === 'true') {
      conditions.push('f.is_featured = 1');
    }

    if (popular === 'true') {
      conditions.push('f.is_popular = 1');
    }

    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = ' WHERE ' + conditions.join(' AND ');
    }

    let orderBy = 'f.is_featured DESC, f.rating DESC, f.id DESC';
    if (sort === 'price_asc') {
      orderBy = 'f.price ASC';
    } else if (sort === 'price_desc') {
      orderBy = 'f.price DESC';
    } else if (sort === 'rating_desc') {
      orderBy = 'f.rating DESC';
    } else if (sort === 'name_asc') {
      orderBy = 'f.name ASC';
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM foods f
      JOIN categories c ON f.category_id = c.id
      ${whereClause}
    `;

    const [countResult] = await pool.query(countQuery, params);
    const totalItems = countResult[0].total;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;

    const dataQuery = `
      SELECT f.*, c.name as category_name, c.slug as category_slug
      FROM foods f
      JOIN categories c ON f.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(dataQuery, [...params, limitNum, offset]);

    res.json({
      success: true,
      data: rows,
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

export async function getFoodByIdOrSlug(req, res, next) {
  try {
    const { idOrSlug } = req.params;
    let query = `
      SELECT f.*, c.name as category_name, c.slug as category_slug
      FROM foods f
      JOIN categories c ON f.category_id = c.id
    `;
    let param = idOrSlug;

    if (!isNaN(idOrSlug)) {
      query += ' WHERE f.id = ?';
      param = Number(idOrSlug);
    } else {
      query += ' WHERE f.slug = ?';
    }

    const [rows] = await pool.query(query, [param]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const food = rows[0];

    const [relatedFoods] = await pool.query(
      'SELECT f.*, c.name as category_name FROM foods f JOIN categories c ON f.category_id = c.id WHERE f.category_id = ? AND f.id != ? AND f.is_available = 1 LIMIT 4',
      [food.category_id, food.id]
    );

    res.json({
      success: true,
      data: {
        ...food,
        relatedFoods
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createFood(req, res, next) {
  try {
    const {
      category_id,
      name,
      description,
      price,
      original_price,
      image_url,
      is_available,
      is_featured,
      is_popular,
      dietary,
      calories,
      prep_time_minutes,
      spiciness
    } = req.body;

    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const [existing] = await pool.query('SELECT id FROM foods WHERE slug = ?', [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const [result] = await pool.query(
      `INSERT INTO foods (
        category_id, name, slug, description, price, original_price,
        image_url, is_available, is_featured, is_popular, dietary,
        calories, prep_time_minutes, spiciness
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name.trim(),
        slug,
        description || null,
        Number(price),
        original_price ? Number(original_price) : null,
        image_url || null,
        is_available !== false ? 1 : 0,
        is_featured ? 1 : 0,
        is_popular ? 1 : 0,
        dietary || 'non-veg',
        calories ? Number(calories) : null,
        prep_time_minutes ? Number(prep_time_minutes) : 20,
        spiciness || 'mild'
      ]
    );

    const [newFood] = await pool.query('SELECT f.*, c.name as category_name FROM foods f JOIN categories c ON f.category_id = c.id WHERE f.id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: newFood[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFood(req, res, next) {
  try {
    const { id } = req.params;
    const {
      category_id,
      name,
      description,
      price,
      original_price,
      image_url,
      is_available,
      is_featured,
      is_popular,
      dietary,
      calories,
      prep_time_minutes,
      spiciness
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    let slug = existing[0].slug;
    if (name && name.trim() !== existing[0].name) {
      const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const [conflict] = await pool.query('SELECT id FROM foods WHERE slug = ? AND id != ?', [slug, id]);
        if (conflict.length === 0) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    await pool.query(
      `UPDATE foods SET
        category_id = COALESCE(?, category_id),
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        image_url = COALESCE(?, image_url),
        is_available = COALESCE(?, is_available),
        is_featured = COALESCE(?, is_featured),
        is_popular = COALESCE(?, is_popular),
        dietary = COALESCE(?, dietary),
        calories = COALESCE(?, calories),
        prep_time_minutes = COALESCE(?, prep_time_minutes),
        spiciness = COALESCE(?, spiciness)
      WHERE id = ?`,
      [
        category_id || null,
        name ? name.trim() : null,
        slug,
        description !== undefined ? description : null,
        price !== undefined ? Number(price) : null,
        original_price !== undefined ? (original_price ? Number(original_price) : null) : null,
        image_url !== undefined ? image_url : null,
        is_available !== undefined ? (is_available ? 1 : 0) : null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        is_popular !== undefined ? (is_popular ? 1 : 0) : null,
        dietary || null,
        calories !== undefined ? (calories ? Number(calories) : null) : null,
        prep_time_minutes !== undefined ? Number(prep_time_minutes) : null,
        spiciness || null,
        id
      ]
    );

    const [updated] = await pool.query('SELECT f.*, c.name as category_name FROM foods f JOIN categories c ON f.category_id = c.id WHERE f.id = ?', [id]);

    res.json({
      success: true,
      message: 'Dish updated successfully',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleAvailability(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT is_available FROM foods WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const currentStatus = rows[0].is_available;
    const newStatus = currentStatus ? 0 : 1;

    await pool.query('UPDATE foods SET is_available = ? WHERE id = ?', [newStatus, id]);

    res.json({
      success: true,
      message: `Dish availability set to ${newStatus ? 'available' : 'unavailable'}`,
      is_available: Boolean(newStatus)
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFood(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM foods WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    res.json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
