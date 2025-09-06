import { createClient } from '@supabase/supabase-js';

// 使用环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export const OrderService = {
  // 创建新订单
  async createOrder(orderData) {
    try {
      if (!supabase) {
        console.warn('Supabase not initialized');
        return { success: false, error: 'Database not available' };
      }

      const order = {
        id: orderData.orderId || `order_${Date.now()}`,
        customer_email: orderData.customerEmail,
        plan_name: orderData.planName,
        price: orderData.price,
        currency: orderData.currency || 'USD',
        status: orderData.status || 'pending',
        payment_method: orderData.paymentMethod || 'airwallex',
        airwallex_payment_id: orderData.airwallexPaymentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select();

      if (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Create order error:', error);
      return { success: false, error: error.message };
    }
  },

  // 更新订单状态
  async updateOrderStatus(orderId, status, additionalData = {}) {
    try {
      if (!supabase) {
        console.warn('Supabase not initialized');
        return { success: false, error: 'Database not available' };
      }

      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalData
      };

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select();

      if (error) {
        console.error('Error updating order:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Update order error:', error);
      return { success: false, error: error.message };
    }
  },

  // 获取订单信息
  async getOrder(orderId) {
    try {
      if (!supabase) {
        console.warn('Supabase not initialized');
        return { success: false, error: 'Database not available' };
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error getting order:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Get order error:', error);
      return { success: false, error: error.message };
    }
  },

  // 获取用户的订单列表
  async getUserOrders(customerEmail, limit = 10) {
    try {
      if (!supabase) {
        console.warn('Supabase not initialized');
        return { success: false, error: 'Database not available' };
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', customerEmail)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting user orders:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Get user orders error:', error);
      return { success: false, error: error.message };
    }
  },

  // 创建订阅记录
  async createSubscription(subscriptionData) {
    try {
      if (!supabase) {
        console.warn('Supabase not initialized');
        return { success: false, error: 'Database not available' };
      }

      const subscription = {
        id: subscriptionData.subscriptionId || `sub_${Date.now()}`,
        order_id: subscriptionData.orderId,
        customer_email: subscriptionData.customerEmail,
        plan_name: subscriptionData.planName,
        status: subscriptionData.status || 'active',
        start_date: subscriptionData.startDate || new Date().toISOString(),
        end_date: subscriptionData.endDate,
        vpn_config_url: subscriptionData.vpnConfigUrl,
        devices_limit: subscriptionData.devicesLimit || 5,
        bandwidth_limit: subscriptionData.bandwidthLimit || 'unlimited',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscription])
        .select();

      if (error) {
        console.error('Error creating subscription:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Create subscription error:', error);
      return { success: false, error: error.message };
    }
  },

  // 获取用户的订阅列表
  async getUserSubscriptions(customerEmail) {
    try {
      if (!supabase) {
        console.warn('Supabase not initialized');
        return { success: false, error: 'Database not available' };
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_email', customerEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting user subscriptions:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      return { success: false, error: error.message };
    }
  },

  // 更新订阅状态
  async updateSubscriptionStatus(subscriptionId, status) {
    try {
      if (!supabase) {
        console.warn('Supabase not initialized');
        return { success: false, error: 'Database not available' };
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', subscriptionId)
        .select();

      if (error) {
        console.error('Error updating subscription:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Update subscription error:', error);
      return { success: false, error: error.message };
    }
  },

  // 计算订阅到期时间
  calculateExpiryDate(planName, startDate = new Date()) {
    const start = new Date(startDate);
    
    // 根据套餐名称计算到期时间
    if (planName.includes('12个月') || planName.includes('12month')) {
      start.setFullYear(start.getFullYear() + 1);
    } else if (planName.includes('6个月') || planName.includes('6month')) {
      start.setMonth(start.getMonth() + 6);
    } else if (planName.includes('3个月') || planName.includes('3month')) {
      start.setMonth(start.getMonth() + 3);
    } else if (planName.includes('1个月') || planName.includes('1month')) {
      start.setMonth(start.getMonth() + 1);
    } else {
      // 默认12个月
      start.setFullYear(start.getFullYear() + 1);
    }
    
    return start.toISOString();
  }
};