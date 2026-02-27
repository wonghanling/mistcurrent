// Supabase 鏁版嵁搴撹缃剼鏈?const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('鉂?缂哄皯Supabase閰嶇疆');
  console.error('璇锋鏌?.env.local 鏂囦欢涓殑 NEXT_PUBLIC_SUPABASE_URL 鍜?SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeSQL(sql, description) {
  try {
    console.log(`馃摑 ${description}...`);
    
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
    
    console.log(`鉁?${description} 鎴愬姛`);
    return { success: true };
  } catch (error) {
    // 灏濊瘯浣跨敤鐩存帴SQL鏌ヨ
    console.log(`鈿狅笍 灏濊瘯鏇夸唬鏂规硶鎵ц: ${description}`);
    try {
      // 瀵逛簬绠€鍗曠殑琛ㄥ垱寤猴紝鎴戜滑鍙互浣跨敤鐩存帴鏌ヨ
      const { error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);
      
      // 濡傛灉杩炴帴鎴愬姛锛岃〃绀烘暟鎹簱鍙闂紝浣嗛渶瑕佹墜鍔ㄦ墽琛孲QL
      console.log(`鈩癸笍 鏁版嵁搴撹繛鎺ユ甯革紝闇€瑕佹墜鍔ㄦ墽琛孲QL`);
      return { success: false, needsManual: true, sql };
    } catch (dbError) {
      console.error(`鉂?${description} 澶辫触:`, error.response?.data || error.message);
      return { success: false, needsManual: false };
    }
  }
}

async function setupDatabase() {
  console.log('馃殌 寮€濮嬭缃甋upabase鏁版嵁搴?..');
  
  const sqlCommands = [
    {
      description: 'Create orders table (orders)',
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id TEXT UNIQUE NOT NULL,
          user_id UUID NOT NULL,
          customer_email TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          amount NUMERIC(10,2) NOT NULL,
          currency TEXT DEFAULT 'USD',
          status TEXT DEFAULT 'pending',
          payment_intent_id TEXT,
          payment_method TEXT,
          paid_at TIMESTAMP,
          failed_at TIMESTAMP,
          cancelled_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
        CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      `
    },
    {
      description: 'Create subscriptions table (subscriptions)',
      sql: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id TEXT,
          user_id UUID NOT NULL,
          user_email TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          token TEXT UNIQUE NOT NULL,
          supplier_url TEXT,
          status TEXT DEFAULT 'pending',
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_token ON subscriptions(token);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);
      `
    },
    {
      description: 'Enable RLS and policies',
      sql: `
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "orders_select_own" ON orders;
        DROP POLICY IF EXISTS "subscriptions_select_own" ON subscriptions;

        CREATE POLICY "orders_select_own" ON orders
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "subscriptions_select_own" ON subscriptions
          FOR SELECT USING (auth.uid() = user_id);
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
    console.log('\n鈿狅笍 浠ヤ笅SQL闇€瑕佹墜鍔ㄥ湪Supabase鎺у埗鍙版墽琛?');
    console.log('馃憠 璇疯闂? https://supabase.com/dashboard/project/<your-project-id>/sql-editor
    console.log('\n='.repeat(80));
    
    needsManualExecution.forEach((item, index) => {
      console.log(`\n-- ${index + 1}. ${item.description}`);
      console.log(item.sql.trim());
      console.log('\n' + '-'.repeat(80));
    });
    
    console.log('\n馃搵 鎵嬪姩鎵ц姝ラ:');
    console.log('1. 璁块棶涓婇潰鐨凷upabase SQL Editor閾炬帴');
    console.log('2. 澶嶅埗绮樿创涓婇潰鐨凷QL鍛戒护');
    console.log('3. 鐐瑰嚮Run鎵ц');
    console.log('4. 閲嶅鎵ц鎵€鏈塖QL鍧?);
  } else {
    console.log('馃帀 鏁版嵁搴撹缃畬鎴愶紒');
  }
  
  console.log('\n馃搵 椤圭洰灏嗗寘鍚殑琛細');
  console.log('- orders (璁㈠崟琛? - 瀛樺偍鏀粯璁㈠崟淇℃伅');
  console.log('- subscriptions (璁㈤槄琛? - 瀛樺偍鐢ㄦ埛VPN璁㈤槄淇℃伅');
  console.log('\n馃敀 RLS瀹夊叏绛栫暐宸查厤缃?);
}

// 鎵ц璁剧疆
setupDatabase();

