export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', '), errors });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  next();
}

export function validateAddress(req, res, next) {
  const { recipient_name, phone, street_address, city, state, postal_code } = req.body;
  const errors = [];

  if (!recipient_name || !recipient_name.trim()) errors.push('Recipient name is required');
  if (!phone || !phone.trim()) errors.push('Phone number is required');
  if (!street_address || !street_address.trim()) errors.push('Street address is required');
  if (!city || !city.trim()) errors.push('City is required');
  if (!state || !state.trim()) errors.push('State is required');
  if (!postal_code || !postal_code.trim()) errors.push('Postal code is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', '), errors });
  }
  next();
}

export function validateFoodItem(req, res, next) {
  const { name, category_id, price } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Food name is required');
  if (!category_id) errors.push('Category is required');
  if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
    errors.push('Valid positive price is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', '), errors });
  }
  next();
}
