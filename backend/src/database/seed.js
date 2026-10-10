import pool from '../config/db.js';

async function seedData() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const categoriesData = [
      {
        name: 'Starters & Appetizers',
        slug: 'starters',
        description: 'Exquisite small plates featuring truffle burrata, seared scallops, and heirloom tartines.',
        image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
        display_order: 1
      },
      {
        name: 'Signature Mains',
        slug: 'mains',
        description: 'Masterfully prepared entrées showcasing prime cuts, wild seafood, and rich reductions.',
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        display_order: 2
      },
      {
        name: 'Artisanal Pastas & Risottos',
        slug: 'pastas',
        description: 'Handcrafted pasta ribbons and slow-simmered Carnaroli risottos infused with saffron and black truffle.',
        image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        display_order: 3
      },
      {
        name: 'Wood-Fired Pizzas',
        slug: 'pizzas',
        description: 'Fermented sourdough crust baked at 900°F with San Marzano tomatoes and fior di latte.',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        display_order: 4
      },
      {
        name: 'Epicurean Steaks & Grills',
        slug: 'steaks',
        description: 'Dry-aged Wagyu and Angus cuts grilled over Japanese binchotan charcoal.',
        image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
        display_order: 5
      },
      {
        name: 'Plant-Based Delicacies',
        slug: 'plant-based',
        description: 'Botanical gastronomy curated from organic microgreens, wild mushrooms, and cold-pressed oils.',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        display_order: 6
      },
      {
        name: 'Decadent Desserts',
        slug: 'desserts',
        description: 'Pastry art featuring Valrhona dark chocolate lava, gold leaf pistachio mille-feuille, and Sicilian gelato.',
        image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        display_order: 7
      },
      {
        name: 'Craft Beverages & Elixirs',
        slug: 'beverages',
        description: 'Botanical infusions, smoked mocktails, pressed sparkling fruit reductions, and cold brew tonics.',
        image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        display_order: 8
      }
    ];

    const categoryMap = {};

    for (const cat of categoriesData) {
      const [existing] = await connection.query('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
      if (existing.length === 0) {
        const [result] = await connection.query(`
          INSERT INTO categories (name, slug, description, image_url, display_order)
          VALUES (?, ?, ?, ?, ?)
        `, [cat.name, cat.slug, cat.description, cat.image_url, cat.display_order]);
        categoryMap[cat.slug] = result.insertId;
      } else {
        categoryMap[cat.slug] = existing[0].id;
      }
    }

    const foodsData = [
      {
        category_slug: 'starters',
        name: 'Truffle Burrata & Heirloom Carpaccio',
        slug: 'truffle-burrata-carpaccio',
        description: 'Imported Puglia burrata over heirloom tomato carpaccio, aged Modena balsamico, and freshly shaved black winter truffles.',
        price: 24.50,
        original_price: 28.00,
        image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: true,
        dietary: 'veg',
        calories: 420,
        prep_time_minutes: 15,
        spiciness: 'mild',
        rating: 4.95,
        rating_count: 84
      },
      {
        category_slug: 'starters',
        name: 'Pan-Seared Hokkaido Scallops',
        slug: 'pan-seared-hokkaido-scallops',
        description: 'Diver scallops pan-seared with brown butter emulsion, sweet pea puree, and crispy pancetta lardons.',
        price: 29.00,
        original_price: 34.00,
        image_url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: false,
        dietary: 'non-veg',
        calories: 380,
        prep_time_minutes: 18,
        spiciness: 'mild',
        rating: 4.90,
        rating_count: 62
      },
      {
        category_slug: 'starters',
        name: 'Crispy Wild Morel Tartlet',
        slug: 'crispy-wild-morel-tartlet',
        description: 'Delicate buttery pastry shell stuffed with foraged wild morels, goat cheese mousse, and fresh thyme blossom.',
        price: 22.00,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: false,
        is_popular: false,
        dietary: 'veg',
        calories: 310,
        prep_time_minutes: 15,
        spiciness: 'mild',
        rating: 4.82,
        rating_count: 41
      },
      {
        category_slug: 'mains',
        name: 'Chilean Sea Bass Glacé',
        slug: 'chilean-sea-bass-glace',
        description: 'Sustainably caught Chilean sea bass poached in lemongrass fumet, served over bok choy and ginger-dashi bouillon.',
        price: 48.00,
        original_price: 54.00,
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: true,
        dietary: 'non-veg',
        calories: 590,
        prep_time_minutes: 25,
        spiciness: 'mild',
        rating: 4.98,
        rating_count: 142
      },
      {
        category_slug: 'mains',
        name: 'Duck Magret à l’Orange Sanguine',
        slug: 'duck-magret-orange-sanguine',
        description: 'Pan-roasted Moulard duck breast with blood orange gastrique, glazed baby carrots, and parsnip mousseline.',
        price: 42.00,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1514944298352-f47a610e2069?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: false,
        is_popular: true,
        dietary: 'non-veg',
        calories: 680,
        prep_time_minutes: 28,
        spiciness: 'mild',
        rating: 4.88,
        rating_count: 95
      },
      {
        category_slug: 'pastas',
        name: 'Handmade Tagliolini al Tartufo Bianco',
        slug: 'tagliolini-tartufo-bianco',
        description: 'Golden 30-yolk hand-rolled ribbon pasta gently tossed with alpine butter and generous Piedmont white truffle shavings.',
        price: 38.00,
        original_price: 44.00,
        image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: true,
        dietary: 'veg',
        calories: 520,
        prep_time_minutes: 20,
        spiciness: 'mild',
        rating: 4.96,
        rating_count: 178
      },
      {
        category_slug: 'pastas',
        name: 'Saffron Lobster Ravioloni',
        slug: 'saffron-lobster-ravioloni',
        description: 'Jumbo pasta pillows filled with Maine lobster claw meat and mascarpone in velvety saffron shellfish bisque.',
        price: 41.00,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: false,
        is_popular: true,
        dietary: 'non-veg',
        calories: 610,
        prep_time_minutes: 22,
        spiciness: 'mild',
        rating: 4.91,
        rating_count: 110
      },
      {
        category_slug: 'pizzas',
        name: 'Tartufata & Fior di Latte Pizza',
        slug: 'tartufata-fior-di-latte-pizza',
        description: 'Slow-fermented artisan crust, black truffle paste, fresh mozzarella, wild mushrooms, and arugula drizzled with chili honey.',
        price: 28.50,
        original_price: 32.00,
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: true,
        dietary: 'veg',
        calories: 780,
        prep_time_minutes: 20,
        spiciness: 'mild',
        rating: 4.93,
        rating_count: 156
      },
      {
        category_slug: 'pizzas',
        name: 'Prosciutto San Daniele & Fig Pizza',
        slug: 'prosciutto-san-daniele-pizza',
        description: 'Aged San Daniele prosciutto, mission figs, Gorgonzola dolce, and rosemary-infused extra virgin olive oil.',
        price: 31.00,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: false,
        is_popular: false,
        dietary: 'non-veg',
        calories: 820,
        prep_time_minutes: 20,
        spiciness: 'mild',
        rating: 4.87,
        rating_count: 88
      },
      {
        category_slug: 'steaks',
        name: 'A5 Miyazaki Wagyu Ribeye (8oz)',
        slug: 'a5-miyazaki-wagyu-ribeye',
        description: 'Authentic A5 Japanese black cattle ribeye grilled over binchotan coals with smoked Maldon salt and bone marrow jus.',
        price: 95.00,
        original_price: 110.00,
        image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: true,
        dietary: 'non-veg',
        calories: 890,
        prep_time_minutes: 30,
        spiciness: 'mild',
        rating: 4.99,
        rating_count: 210
      },
      {
        category_slug: 'steaks',
        name: 'Prime Tomahawk Rib Steak (32oz)',
        slug: 'prime-tomahawk-steak',
        description: 'Dry-aged 45-day bone-in tomahawk rib steak served with roasted garlic herb compound butter and charred shallots.',
        price: 125.00,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: false,
        is_popular: true,
        dietary: 'non-veg',
        calories: 1450,
        prep_time_minutes: 35,
        spiciness: 'mild',
        rating: 4.94,
        rating_count: 73
      },
      {
        category_slug: 'plant-based',
        name: 'Roasted King Oyster Scallops',
        slug: 'roasted-king-oyster-scallops',
        description: 'Caramelized king oyster mushroom medallions over sweet parsnip puree, pomegranate glaze, and crispy fried capers.',
        price: 26.00,
        original_price: 30.00,
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: false,
        dietary: 'vegan',
        calories: 340,
        prep_time_minutes: 18,
        spiciness: 'mild',
        rating: 4.89,
        rating_count: 53
      },
      {
        category_slug: 'plant-based',
        name: 'Smoked Beetroot Tartare',
        slug: 'smoked-beetroot-tartare',
        description: 'Binchotan-smoked roasted beets finely diced with Dijon emulsion, shallot crisp, caper berries, and seeded rye crisps.',
        price: 23.50,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: false,
        is_popular: false,
        dietary: 'vegan',
        calories: 280,
        prep_time_minutes: 15,
        spiciness: 'mild',
        rating: 4.81,
        rating_count: 39
      },
      {
        category_slug: 'desserts',
        name: 'Valrhona Grand Cru Chocolate Sphère',
        slug: 'valrhona-grand-cru-sphere',
        description: 'Dark single-origin chocolate dome filled with hazelnut praline, poured table-side with warm Venezuelan cocoa sauce.',
        price: 19.50,
        original_price: 23.00,
        image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: true,
        dietary: 'veg',
        calories: 540,
        prep_time_minutes: 15,
        spiciness: 'mild',
        rating: 4.97,
        rating_count: 189
      },
      {
        category_slug: 'desserts',
        name: 'Sicilian Pistachio Mille-Feuille',
        slug: 'sicilian-pistachio-mille-feuille',
        description: 'Caramelized puff pastry layers with bronte pistachio namelaka, wild raspberries, and 24-karat edible gold flake.',
        price: 21.00,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: false,
        is_popular: true,
        dietary: 'veg',
        calories: 460,
        prep_time_minutes: 15,
        spiciness: 'mild',
        rating: 4.92,
        rating_count: 115
      },
      {
        category_slug: 'beverages',
        name: 'Smoked Rosemary Blackberry Botanical',
        slug: 'smoked-rosemary-blackberry-botanical',
        description: 'Cold-pressed wild blackberry nectar, smoked rosemary sprig, sparkling elderflower water, and clarified lime.',
        price: 14.00,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: true,
        is_popular: true,
        dietary: 'vegan',
        calories: 120,
        prep_time_minutes: 8,
        spiciness: 'mild',
        rating: 4.88,
        rating_count: 82
      },
      {
        category_slug: 'beverages',
        name: 'Yuzu Blossom & Japanese Sencha Elixir',
        slug: 'yuzu-blossom-sencha-elixir',
        description: 'First-harvest Kyoto green tea cold infused for 18 hours with fresh Kochi yuzu citrus and organic raw wildflower honey.',
        price: 13.50,
        original_price: null,
        image_url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
        is_available: true,
        is_featured: false,
        is_popular: false,
        dietary: 'veg',
        calories: 95,
        prep_time_minutes: 8,
        spiciness: 'mild',
        rating: 4.84,
        rating_count: 47
      }
    ];

    for (const food of foodsData) {
      const categoryId = categoryMap[food.category_slug];
      if (!categoryId) continue;

      const [existingFood] = await connection.query('SELECT id FROM foods WHERE slug = ?', [food.slug]);
      if (existingFood.length === 0) {
        await connection.query(`
          INSERT INTO foods (
            category_id, name, slug, description, price, original_price,
            image_url, is_available, is_featured, is_popular, dietary,
            calories, prep_time_minutes, spiciness, rating, rating_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          categoryId, food.name, food.slug, food.description, food.price, food.original_price,
          food.image_url, food.is_available, food.is_featured, food.is_popular, food.dietary,
          food.calories, food.prep_time_minutes, food.spiciness, food.rating, food.rating_count
        ]);
      }
    }

    const [customerUser] = await connection.query('SELECT id FROM users WHERE email = ?', ['customer@restaura.com']);
    if (customerUser.length > 0) {
      const customerId = customerUser[0].id;

      const [addrCheck] = await connection.query('SELECT id FROM addresses WHERE user_id = ?', [customerId]);
      let addressId = null;
      if (addrCheck.length === 0) {
        const [addrRes] = await connection.query(`
          INSERT INTO addresses (user_id, label, recipient_name, phone, street_address, landmark, city, state, postal_code, is_default)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          customerId,
          'Penthouse Residence',
          'Elena Rostova',
          '+1 (555) 876-5432',
          '720 Montgomery Street, Suite 44B',
          'Near Transamerica Pyramid',
          'San Francisco',
          'CA',
          '94111',
          1
        ]);
        addressId = addrRes.insertId;

        await connection.query(`
          INSERT INTO addresses (user_id, label, recipient_name, phone, street_address, landmark, city, state, postal_code, is_default)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          customerId,
          'Design Studio',
          'Elena Rostova',
          '+1 (555) 876-5432',
          '180 Townsend St, Floor 3',
          'Oracle Park Tech Corridor',
          'San Francisco',
          'CA',
          '94107',
          0
        ]);
      } else {
        addressId = addrCheck[0].id;
      }

      const [allFoods] = await connection.query('SELECT id, name, price, image_url FROM foods LIMIT 5');
      if (allFoods.length >= 2) {
        const [wishCheck] = await connection.query('SELECT id FROM wishlist_items WHERE user_id = ?', [customerId]);
        if (wishCheck.length === 0) {
          await connection.query('INSERT IGNORE INTO wishlist_items (user_id, food_id) VALUES (?, ?)', [customerId, allFoods[0].id]);
          await connection.query('INSERT IGNORE INTO wishlist_items (user_id, food_id) VALUES (?, ?)', [customerId, allFoods[1].id]);
        }

        const [orderCheck] = await connection.query('SELECT id FROM orders WHERE user_id = ?', [customerId]);
        if (orderCheck.length === 0) {
          const item1 = allFoods[0];
          const item2 = allFoods[1];
          const subtotal = Number(item1.price) + Number(item2.price);
          const tax = Number((subtotal * 0.085).toFixed(2));
          const deliveryFee = 4.99;
          const total = Number((subtotal + tax + deliveryFee).toFixed(2));

          const [orderRes] = await connection.query(`
            INSERT INTO orders (
              order_number, user_id, address_id, recipient_name, recipient_phone,
              delivery_address, delivery_instructions, subtotal, tax, delivery_fee,
              discount, total_amount, status, payment_method, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            'RES-78921',
            customerId,
            addressId,
            'Elena Rostova',
            '+1 (555) 876-5432',
            '720 Montgomery Street, Suite 44B, San Francisco, CA 94111',
            'Please ring bell 44B and leave with concierge if unavailable.',
            subtotal,
            tax,
            deliveryFee,
            0.00,
            total,
            'PREPARING',
            'ONLINE',
            'PAID'
          ]);

          const orderId = orderRes.insertId;
          await connection.query(`
            INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity, total_price, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)
          `, [
            orderId, item1.id, item1.name, item1.price, 1, item1.price, item1.image_url,
            orderId, item2.id, item2.name, item2.price, 1, item2.price, item2.image_url
          ]);

          const [deliveredRes] = await connection.query(`
            INSERT INTO orders (
              order_number, user_id, address_id, recipient_name, recipient_phone,
              delivery_address, delivery_instructions, subtotal, tax, delivery_fee,
              discount, total_amount, status, payment_method, payment_status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 2 DAY))
          `, [
            'RES-78905',
            customerId,
            addressId,
            'Elena Rostova',
            '+1 (555) 876-5432',
            '720 Montgomery Street, Suite 44B, San Francisco, CA 94111',
            'Door code #8821',
            62.50,
            5.31,
            0.00,
            5.00,
            62.81,
            'DELIVERED',
            'COD',
            'PAID'
          ]);

          const deliveredOrderId = deliveredRes.insertId;
          await connection.query(`
            INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity, total_price, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            deliveredOrderId, item1.id, item1.name, item1.price, 2, Number(item1.price) * 2, item1.image_url
          ]);
        }
      }
    }

    await connection.commit();
    process.stdout.write('Database seeded successfully.\n');
  } catch (error) {
    await connection.rollback();
    process.stderr.write(`Seeding error: ${error.message}\n`);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

seedData();
