// Test Supabase database connection and schema
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase configuration in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const testUserId = '00000000-0000-0000-0000-000000000000';

async function testDatabase() {
  console.log('Testing Supabase database connection...');

  try {
    console.log('Checking orders table...');
    const { error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (ordersError) {
      console.error('Orders table access failed:', ordersError.message);
      return;
    }
    console.log('Orders table OK');

    console.log('Checking subscriptions table...');
    const { error: subsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);

    if (subsError) {
      console.error('Subscriptions table access failed:', subsError.message);
      return;
    }
    console.log('Subscriptions table OK');

    console.log('Inserting test order...');
    const testOrder = {
      order_id: `TEST_ORDER_${Date.now()}`,
      user_id: testUserId,
      customer_email: 'test@example.com',
      plan_id: '12month',
      amount: 71.88,
      currency: 'USD',
      status: 'pending',
      payment_intent_id: 'test_payment_intent',
      payment_method: 'airwallex',
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select();

    if (orderError) {
      console.error('Order insert failed:', orderError.message);
    } else {
      console.log('Order insert OK:', orderData[0].id);
    }

    console.log('Inserting test subscription...');
    const testSubscription = {
      order_id: testOrder.order_id,
      user_id: testUserId,
      user_email: 'test@example.com',
      plan_id: '12month',
      token: `TOKEN_${Math.random().toString(36).substr(2, 9)}`,
      supplier_url: `https://supplier.example.com/subscribe/${Date.now()}`,
      status: 'active',
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .insert(testSubscription)
      .select();

    if (subError) {
      console.error('Subscription insert failed:', subError.message);
    } else {
      console.log('Subscription insert OK:', subData[0].id);
    }

    console.log('Querying test orders...');
    const { data: orders, error: queryError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', testUserId)
      .limit(5);

    if (queryError) {
      console.error('Query failed:', queryError.message);
    } else {
      console.log(`Query OK: ${orders.length} rows`);
    }

    console.log('Cleaning up test data...');
    await supabase.from('orders').delete().eq('user_id', testUserId);
    await supabase.from('subscriptions').delete().eq('user_id', testUserId);

    console.log('Database test completed.');
  } catch (error) {
    console.error('Database test failed:', error.message || error);
  }
}

testDatabase();
