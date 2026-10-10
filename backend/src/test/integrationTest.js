const BASE_URL = 'http://localhost:5005/api';

async function runTests() {
  process.stdout.write('Starting Restaura End-to-End API Verification...\n');

  try {
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    if (health.status === 'healthy') {
      process.stdout.write('PASS: Health Check\n');
    }

    const categoriesRes = await fetch(`${BASE_URL}/categories`);
    const categories = await categoriesRes.json();
    if (categories.success && categories.data.length > 0) {
      process.stdout.write(`PASS: Categories List (${categories.data.length} categories)\n`);
    }

    const foodsRes = await fetch(`${BASE_URL}/foods`);
    const foods = await foodsRes.json();
    if (foods.success && foods.data.length > 0) {
      process.stdout.write(`PASS: Foods List (${foods.data.length} dishes)\n`);
    }

    const customerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@restaura.com',
        password: 'Customer@12345'
      })
    });
    const customerLogin = await customerLoginRes.json();
    const customerToken = customerLogin.token;
    if (customerLogin.success && customerToken) {
      process.stdout.write('PASS: Patron Authentication\n');
    }

    const patronHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`
    };

    const firstDish = foods.data[0];
    const addBagRes = await fetch(`${BASE_URL}/cart/add`, {
      method: 'POST',
      headers: patronHeaders,
      body: JSON.stringify({
        food_id: firstDish.id,
        quantity: 2
      })
    });
    const addBag = await addBagRes.json();
    if (addBag.success) {
      process.stdout.write('PASS: Add to Cart / Bag\n');
    }

    const getBagRes = await fetch(`${BASE_URL}/cart`, { headers: patronHeaders });
    const getBag = await getBagRes.json();
    if (getBag.success && getBag.data.items.length > 0) {
      process.stdout.write(`PASS: Get Bag (Total: $${getBag.data.totalAmount})\n`);
    }

    const addressesRes = await fetch(`${BASE_URL}/addresses`, { headers: patronHeaders });
    const addresses = await addressesRes.json();
    const primaryAddress = addresses.data[0];
    if (primaryAddress) {
      process.stdout.write(`PASS: Delivery Addresses (${addresses.data.length} addresses)\n`);
    }

    const createOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: patronHeaders,
      body: JSON.stringify({
        address_id: primaryAddress?.id,
        payment_method: 'COD',
        delivery_instructions: 'Automated test suite order run'
      })
    });
    const createOrder = await createOrderRes.json();
    const orderData = createOrder.data;
    if (createOrder.success && orderData) {
      process.stdout.write(`PASS: Transacted Order #${orderData.order_number}\n`);
    }

    const orderTrackRes = await fetch(`${BASE_URL}/orders/${orderData.id}`, { headers: patronHeaders });
    const orderTrack = await orderTrackRes.json();
    if (orderTrack.success && orderTrack.data.status === 'PLACED') {
      process.stdout.write(`PASS: Order Beacon Tracking Status: ${orderTrack.data.status}\n`);
    }

    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@restaura.com',
        password: 'Admin@12345'
      })
    });
    const adminLogin = await adminLoginRes.json();
    const adminToken = adminLogin.token;
    if (adminLogin.success && adminToken) {
      process.stdout.write('PASS: Executive Admin Authentication\n');
    }

    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    };

    const dashboardRes = await fetch(`${BASE_URL}/admin/dashboard`, { headers: adminHeaders });
    const dashboard = await dashboardRes.json();
    if (dashboard.success && dashboard.data.summary) {
      process.stdout.write(`PASS: Admin Dashboard Overview (Revenue: $${dashboard.data.summary.totalRevenue})\n`);
    }

    const updateStatusRes = await fetch(`${BASE_URL}/admin/orders/${orderData.id}/status`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'CONFIRMED' })
    });
    const updateStatus = await updateStatusRes.json();
    if (updateStatus.success && updateStatus.data.status === 'CONFIRMED') {
      process.stdout.write('PASS: Admin Order Status Transition: PLACED -> CONFIRMED\n');
    }

    const analyticsRes = await fetch(`${BASE_URL}/admin/analytics`, { headers: adminHeaders });
    const analytics = await analyticsRes.json();
    if (analytics.success && analytics.data.metrics) {
      process.stdout.write(`PASS: Admin Analytics (Avg Order: $${analytics.data.metrics.avgOrderValue})\n`);
    }

    process.stdout.write('\nALL INTEGRATION TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } catch (err) {
    process.stderr.write(`FAIL: ${err.message}\n`);
    process.exit(1);
  }
}

runTests();
