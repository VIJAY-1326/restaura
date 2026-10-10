import pool from '../config/db.js';

export async function getAllCategories(req, res, next) {
  try {
    const { includeInactive } = req.query;
    let query = 'SELECT * FROM categories';
    const params = [];

    if (includeInactive !== 'true') {
      query += ' WHERE is_active = 1';
    }

    query += ' ORDER BY display_order ASC, name ASC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const category = rows[0];
    const [foods] = await pool.query(
      'SELECT * FROM foods WHERE category_id = ? AND is_available = 1 ORDER BY is_featured DESC, name ASC',
      [category.id]
    );

    res.json({
      success: true,
      data: {
        ...category,
        foods
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, description, image_url, display_order, is_active } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const [existing] = await pool.query('SELECT id FROM categories WHERE slug = ? OR name = ?', [slug, name.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Category with this name already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), slug, description || null, image_url || null, display_order || 0, is_active !== false ? 1 : 0]
    );

    const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Category created', data: newCategory[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, image_url, display_order, is_active } = req.body;

    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let slug = existing[0].slug;
    if (name && name.trim() !== existing[0].name) {
      slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    await pool.query(
      `UPDATE categories SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active)
      WHERE id = ?`,
      [
        name ? name.trim() : null,
        slug,
        description !== undefined ? description : null,
        image_url !== undefined ? image_url : null,
        display_order !== undefined ? display_order : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Category updated', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
}
