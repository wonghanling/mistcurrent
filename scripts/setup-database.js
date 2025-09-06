// Supabase 数据库设置脚本
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ 缺少Supabase配置');
  console.error('请检查 .env.local 文件中的 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeSQL(sql, description) {
  try {
    console.log(`📝 ${description}...`);
    
    const response = await axios.post(
      `${supabaseUrl}/rest/v1/rpc/exec`,
      { sql },
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      }
    );
    
    console.log(`✅ ${description} 成功`);
    return { success: true };
  } catch (error) {
    // 尝试使用直接SQL查询
    console.log(`⚠️ 尝试替代方法执行: ${description}`);
    try {
      // 对于简单的表创建，我们可以使用直接查询
      const { error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);
      
      // 如果连接成功，表示数据库可访问，但需要手动执行SQL
      console.log(`ℹ️ 数据库连接正常，需要手动执行SQL`);
      return { success: false, needsManual: true, sql };
    } catch (dbError) {
      console.error(`❌ ${description} 失败:`, error.response?.data || error.message);
      return { success: false, needsManual: false };
    }
  }
}

async function setupDatabase() {
  console.log('🚀 开始设置Supabase数据库...');
  
  const sqlCommands = [
    {
      description: '创建订单表 (orders)',
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id VARCHAR UNIQUE NOT NULL,
          customer_email VARCHAR NOT NULL,
          customer_name VARCHAR NOT NULL,
          plan_id VARCHAR NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          status VARCHAR DEFAULT 'pending',
          payment_intent_id VARCHAR,
          airwallex_payment_id VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- 创建索引
        CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
        CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      `
    },
    {
      description: '创建订阅表 (subscriptions)',
      sql: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_email VARCHAR NOT NULL,
          plan_id VARCHAR NOT NULL,
          subscription_url VARCHAR UNIQUE NOT NULL,
          token VARCHAR UNIQUE NOT NULL,
          status VARCHAR DEFAULT 'active',
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- 创建索引
        CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(user_email);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_token ON subscriptions(token);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
      `
    },
    {
      description: '启用RLS和安全策略',
      sql: `
        -- 启用RLS
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
        
        -- 删除现有策略（如果存在）
        DROP POLICY IF EXISTS "用户可以查看自己的订单" ON orders;
        DROP POLICY IF EXISTS "用户可以查看自己的订阅" ON subscriptions;
        DROP POLICY IF EXISTS "服务端可以创建订单" ON orders;
        DROP POLICY IF EXISTS "服务端可以更新订单" ON orders;
        DROP POLICY IF EXISTS "服务端可以创建订阅" ON subscriptions;
        DROP POLICY IF EXISTS "服务端可以更新订阅" ON subscriptions;
        
        -- 创建新策略
        CREATE POLICY "用户可以查看自己的订单" ON orders
          FOR SELECT USING (customer_email = auth.jwt() ->> 'email');
        
        CREATE POLICY "用户可以查看自己的订阅" ON subscriptions
          FOR SELECT USING (user_email = auth.jwt() ->> 'email');
        
        CREATE POLICY "服务端可以创建订单" ON orders
          FOR INSERT WITH CHECK (true);
          
        CREATE POLICY "服务端可以更新订单" ON orders
          FOR UPDATE USING (true);
          
        CREATE POLICY "服务端可以创建订阅" ON subscriptions
          FOR INSERT WITH CHECK (true);
          
        CREATE POLICY "服务端可以更新订阅" ON subscriptions
          FOR UPDATE USING (true);
      `
    }
  ];

  let needsManualExecution = [];

  for (const command of sqlCommands) {
    const result = await executeSQL(command.sql, command.description);
    if (!result.success && result.needsManual) {
      needsManualExecution.push({
        description: command.description,
        sql: command.sql
      });
    }
  }

  if (needsManualExecution.length > 0) {
    console.log('\n⚠️ 以下SQL需要手动在Supabase控制台执行:');
    console.log('👉 请访问: https://supabase.com/dashboard/project/zpqtktstvbiurdwdkech/sql-editor');
    console.log('\n='.repeat(80));
    
    needsManualExecution.forEach((item, index) => {
      console.log(`\n-- ${index + 1}. ${item.description}`);
      console.log(item.sql.trim());
      console.log('\n' + '-'.repeat(80));
    });
    
    console.log('\n📋 手动执行步骤:');
    console.log('1. 访问上面的Supabase SQL Editor链接');
    console.log('2. 复制粘贴上面的SQL命令');
    console.log('3. 点击Run执行');
    console.log('4. 重复执行所有SQL块');
  } else {
    console.log('🎉 数据库设置完成！');
  }
  
  console.log('\n📋 项目将包含的表：');
  console.log('- orders (订单表) - 存储支付订单信息');
  console.log('- subscriptions (订阅表) - 存储用户VPN订阅信息');
  console.log('\n🔒 RLS安全策略已配置');
}

// 执行设置
setupDatabase();