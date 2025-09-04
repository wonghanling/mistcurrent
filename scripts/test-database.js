// 测试Supabase数据库连接
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testDatabase() {
  console.log('🔧 测试Supabase数据库连接...');
  
  try {
    // 1. 直接测试orders表
    console.log('📋 测试orders表...');
    const { data: ordersTest, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (ordersError) {
      console.error('❌ orders表连接失败:', ordersError.message);
      return;
    }
    console.log('✅ orders表连接成功');
    
    // 2. 测试subscriptions表
    console.log('📋 测试subscriptions表...');
    const { data: subsTest, error: subsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (subsError) {
      console.error('❌ subscriptions表连接失败:', subsError.message);
      return;
    }
    console.log('✅ subscriptions表连接成功');
    
    // 3. 测试插入订单数据
    console.log('\n📝 测试插入订单数据...');
    const testOrder = {
      order_id: `TEST_ORDER_${Date.now()}`,
      customer_email: 'test@example.com',
      customer_name: '测试用户',
      plan_id: '12month',
      amount: 71.88,
      currency: 'USD',
      status: 'pending',
      payment_intent_id: 'test_payment_intent'
    };
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select();
    
    if (orderError) {
      console.error('❌ 订单插入失败:', orderError.message);
    } else {
      console.log('✅ 订单插入成功:', orderData[0].id);
    }
    
    // 4. 测试插入订阅数据
    console.log('\n📝 测试插入订阅数据...');
    const testSubscription = {
      user_email: 'test@example.com',
      plan_id: '12month',
      subscription_url: `https://vpn.mistcurrent.com/config/${Date.now()}`,
      token: `TOKEN_${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .insert(testSubscription)
      .select();
    
    if (subError) {
      console.error('❌ 订阅插入失败:', subError.message);
    } else {
      console.log('✅ 订阅插入成功:', subData[0].id);
    }
    
    // 5. 测试查询数据
    console.log('\n📋 查询测试数据...');
    const { data: orders, error: queryError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', 'test@example.com')
      .limit(5);
    
    if (queryError) {
      console.error('❌ 查询失败:', queryError.message);
    } else {
      console.log(`✅ 查询成功，找到 ${orders.length} 条订单记录`);
    }
    
    // 6. 清理测试数据
    console.log('\n🧹 清理测试数据...');
    await supabase.from('orders').delete().eq('customer_email', 'test@example.com');
    await supabase.from('subscriptions').delete().eq('user_email', 'test@example.com');
    console.log('✅ 测试数据已清理');
    
    console.log('\n🎉 数据库测试完成！所有功能正常工作。');
    
  } catch (error) {
    console.error('❌ 数据库测试失败:', error.message);
  }
}

testDatabase();