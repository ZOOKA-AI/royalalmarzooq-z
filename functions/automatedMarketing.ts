import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { campaignId, action } = await req.json();

    if (action === 'run_campaign') {
      return await runCampaign(base44, campaignId);
    } else if (action === 'send_review_request') {
      return await sendReviewRequests(base44);
    } else if (action === 'reactivate_customers') {
      return await reactivateInactiveCustomers(base44);
    } else if (action === 'renewal_reminders') {
      return await sendRenewalReminders(base44);
    } else if (action === 'upgrade_offers') {
      return await sendUpgradeOffers(base44);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Marketing automation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// إرسال طلبات التقييم بعد إكمال الخدمة
async function sendReviewRequests(base44) {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const completedOrders = await base44.asServiceRole.entities.Order.filter({
    status: 'مكتمل',
    payment_status: 'مدفوع'
  });

  let sentCount = 0;
  for (const order of completedOrders) {
    const orderDate = new Date(order.updated_date);
    const hoursSinceCompletion = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60);

    // إرسال بعد 24 ساعة من الإكمال
    if (hoursSinceCompletion >= 24 && hoursSinceCompletion <= 72) {
      const existingReview = await base44.asServiceRole.entities.Review.filter({
        order_id: order.id
      });

      if (existingReview.length === 0) {
        const message = await generatePersonalizedMessage(base44, order, 'review_request');
        
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: order.client_email || `${order.client_phone}@sms.gateway`,
          subject: 'شاركنا تجربتك - رويال للتنظيف',
          body: message
        });

        sentCount++;
      }
    }
  }

  return Response.json({ 
    success: true, 
    message: `تم إرسال ${sentCount} طلب تقييم`,
    sent: sentCount 
  });
}

// إعادة تنشيط العملاء غير النشطين
async function reactivateInactiveCustomers(base44) {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const allClients = await base44.asServiceRole.entities.Client.list();
  const allOrders = await base44.asServiceRole.entities.Order.list();

  let sentCount = 0;
  for (const client of allClients) {
    const clientOrders = allOrders.filter(o => o.client_id === client.id);
    
    if (clientOrders.length > 0) {
      const lastOrder = clientOrders.sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      )[0];
      
      const lastOrderDate = new Date(lastOrder.created_date);
      
      if (lastOrderDate < twoMonthsAgo) {
        const offer = await generatePersonalizedOffer(base44, client, clientOrders);
        
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: client.email || `${client.phone}@sms.gateway`,
          subject: `نشتاق لك ${client.name} - عرض خاص 30% خصم`,
          body: offer
        });

        sentCount++;
      }
    }
  }

  return Response.json({ 
    success: true, 
    message: `تم إرسال ${sentCount} عرض لإعادة تنشيط العملاء`,
    sent: sentCount 
  });
}

// تذكيرات تجديد الاشتراكات
async function sendRenewalReminders(base44) {
  const subscriptions = await base44.asServiceRole.entities.Subscription.filter({
    status: 'active'
  });

  let sentCount = 0;
  for (const sub of subscriptions) {
    if (sub.next_billing_date) {
      const nextBilling = new Date(sub.next_billing_date);
      const daysUntilRenewal = Math.floor((nextBilling - Date.now()) / (1000 * 60 * 60 * 24));

      // تذكير قبل 7 أيام من التجديد
      if (daysUntilRenewal === 7) {
        const message = `
عزيزنا العميل،

سيتم تجديد اشتراكك في باقة "${sub.plan_name}" تلقائياً بعد 7 أيام.

💰 المبلغ: ${sub.amount} ${sub.currency}
📅 تاريخ التجديد: ${nextBilling.toLocaleDateString('ar-AE')}

✨ هل تريد الترقية؟ احصل على 20% خصم عند الترقية للباقة الأعلى!

شكراً لثقتك بنا 🙏
رويال للتنظيف
        `;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: sub.user_email,
          subject: 'تذكير: تجديد اشتراكك قريباً',
          body: message
        });

        sentCount++;
      }
    }
  }

  return Response.json({ 
    success: true, 
    message: `تم إرسال ${sentCount} تذكير تجديد`,
    sent: sentCount 
  });
}

// عروض الترقية للمشتركين
async function sendUpgradeOffers(base44) {
  const subscriptions = await base44.asServiceRole.entities.Subscription.filter({
    status: 'active'
  });

  const plans = await base44.asServiceRole.entities.SubscriptionPlan.list();
  
  let sentCount = 0;
  for (const sub of subscriptions) {
    const currentPlan = plans.find(p => p.id === sub.plan_id);
    
    if (currentPlan && currentPlan.sort_order < 2) {
      const higherPlans = plans.filter(p => p.sort_order > currentPlan.sort_order && p.is_active);
      
      if (higherPlans.length > 0) {
        const nextPlan = higherPlans.sort((a, b) => a.sort_order - b.sort_order)[0];
        
        const message = `
مرحباً عميلنا العزيز! 👋

نلاحظ أنك مشترك في باقة "${currentPlan.name}". رائع!

✨ هل تعلم أنك تستطيع الترقية لباقة "${nextPlan.name}" والحصول على:
${nextPlan.features.map(f => `✅ ${f}`).join('\n')}

🎁 عرض خاص لك: 20% خصم على الترقية هذا الشهر!

💰 السعر الشهري: ${nextPlan.price_monthly} ${sub.currency} فقط

هل تريد الترقية؟ رد بـ "نعم" أو احجز عبر التطبيق

رويال للتنظيف - نحو الأفضل دائماً 🌟
        `;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: sub.user_email,
          subject: `⬆️ وقت الترقية! ${nextPlan.name} بخصم 20%`,
          body: message
        });

        sentCount++;
      }
    }
  }

  return Response.json({ 
    success: true, 
    message: `تم إرسال ${sentCount} عرض ترقية`,
    sent: sentCount 
  });
}

// توليد رسالة مخصصة بالذكاء الاصطناعي
async function generatePersonalizedMessage(base44, order, type) {
  const prompts = {
    review_request: `اكتب رسالة ودية وقصيرة لطلب تقييم من عميل أكمل خدمة ${order.service_name}. 
اسم العميل: ${order.client_name}
اجعلها شخصية ومهذبة باللغة العربية.`,
    
    promotional: `اكتب عرض ترويجي مغري لعميل سابق:
اسم العميل: ${order.client_name}
آخر خدمة: ${order.service_name}
اجعل العرض مخصص وجذاب بخصم 30%`
  };

  const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: prompts[type] || prompts.review_request,
    add_context_from_internet: false
  });

  return response;
}

// توليد عرض شخصي بالذكاء الاصطناعي
async function generatePersonalizedOffer(base44, client, orderHistory) {
  const mostUsedService = orderHistory
    .reduce((acc, order) => {
      acc[order.service_name] = (acc[order.service_name] || 0) + 1;
      return acc;
    }, {});
  
  const topService = Object.entries(mostUsedService)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'خدمات التنظيف';

  const totalSpent = orderHistory.reduce((sum, o) => sum + (o.total || 0), 0);

  const prompt = `
اكتب رسالة تسويقية مخصصة لعميل غير نشط:
- اسم العميل: ${client.name}
- الخدمة المفضلة: ${topService}
- عدد الطلبات السابقة: ${orderHistory.length}
- إجمالي المصروفات: ${totalSpent} درهم
- التصنيف: ${client.category}

اكتب عرض مخصص جذاب مع خصم 30% يشجعه على العودة. باللغة العربية، ودي، ومحترم.
  `;

  const offer = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: false
  });

  return offer;
}

// تشغيل حملة محددة
async function runCampaign(base44, campaignId) {
  const campaign = await base44.asServiceRole.entities.MarketingCampaign.list();
  const selectedCampaign = campaign.find(c => c.id === campaignId);

  if (!selectedCampaign) {
    return Response.json({ error: 'Campaign not found' }, { status: 404 });
  }

  // تنفيذ الحملة بناءً على نوعها
  let result;
  switch (selectedCampaign.type) {
    case 'review_request':
      result = await sendReviewRequests(base44);
      break;
    case 'reactivation':
      result = await reactivateInactiveCustomers(base44);
      break;
    case 'renewal_reminder':
      result = await sendRenewalReminders(base44);
      break;
    case 'upgrade_offer':
      result = await sendUpgradeOffers(base44);
      break;
    default:
      return Response.json({ error: 'Unsupported campaign type' }, { status: 400 });
  }

  // تحديث إحصائيات الحملة
  await base44.asServiceRole.entities.MarketingCampaign.update(campaignId, {
    sent_count: selectedCampaign.sent_count + (result.sent || 0),
    last_run: new Date().toISOString()
  });

  return result;
}