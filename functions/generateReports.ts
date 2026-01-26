import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { reportType, dateRange } = await req.json();

    // Fetch all necessary data
    const [orders, clients, workers, services, subscriptions, campaigns, reviews] = await Promise.all([
      base44.asServiceRole.entities.Order.list(),
      base44.asServiceRole.entities.Client.list(),
      base44.asServiceRole.entities.Worker.list(),
      base44.asServiceRole.entities.Service.list(),
      base44.asServiceRole.entities.Subscription.list(),
      base44.asServiceRole.entities.MarketingCampaign.list(),
      base44.asServiceRole.entities.Review.list()
    ]);

    // Filter by date range if provided
    const filteredOrders = dateRange ? filterByDateRange(orders, dateRange) : orders;

    let report = {};

    switch (reportType) {
      case 'financial':
        report = generateFinancialReport(filteredOrders, services, subscriptions);
        break;
      case 'marketing':
        report = generateMarketingReport(campaigns, filteredOrders);
        break;
      case 'operational':
        report = generateOperationalReport(filteredOrders, workers, services, reviews, clients);
        break;
      case 'comprehensive':
        report = {
          financial: generateFinancialReport(filteredOrders, services, subscriptions),
          marketing: generateMarketingReport(campaigns, filteredOrders),
          operational: generateOperationalReport(filteredOrders, workers, services, reviews, clients)
        };
        break;
      default:
        return Response.json({ error: 'Invalid report type' }, { status: 400 });
    }

    return Response.json({ success: true, report });
  } catch (error) {
    console.error('Report generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function filterByDateRange(orders, dateRange) {
  const { startDate, endDate } = dateRange;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return orders.filter(order => {
    const orderDate = new Date(order.created_date);
    return orderDate >= start && orderDate <= end;
  });
}

function generateFinancialReport(orders, services, subscriptions) {
  const completedOrders = orders.filter(o => o.status === 'مكتمل');
  const paidOrders = completedOrders.filter(o => o.payment_status === 'مدفوع');

  // Total revenue
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalDiscount = paidOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
  const totalTax = paidOrders.reduce((sum, o) => sum + (o.tax || 0), 0);

  // Subscription revenue
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const subscriptionRevenue = activeSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
  const recurringMRR = subscriptionRevenue; // Monthly Recurring Revenue

  // Revenue by service
  const revenueByService = {};
  paidOrders.forEach(order => {
    const serviceName = order.service_name || 'غير محدد';
    if (!revenueByService[serviceName]) {
      revenueByService[serviceName] = {
        revenue: 0,
        count: 0,
        avgOrderValue: 0
      };
    }
    revenueByService[serviceName].revenue += order.total || 0;
    revenueByService[serviceName].count += 1;
  });

  // Calculate avg order value and profit margins
  Object.keys(revenueByService).forEach(serviceName => {
    const data = revenueByService[serviceName];
    data.avgOrderValue = data.revenue / data.count;
    
    // Estimate profit margin (60% for cleaning services is typical)
    const service = services.find(s => s.name === serviceName);
    const costRatio = 0.4; // 40% cost, 60% profit margin
    data.estimatedProfit = data.revenue * (1 - costRatio);
    data.profitMargin = ((1 - costRatio) * 100).toFixed(1);
  });

  // Payment methods breakdown
  const paymentMethods = {};
  paidOrders.forEach(order => {
    const method = order.payment_method || 'غير محدد';
    paymentMethods[method] = (paymentMethods[method] || 0) + (order.total || 0);
  });

  // Monthly trends
  const monthlyRevenue = {};
  paidOrders.forEach(order => {
    const month = new Date(order.created_date).toISOString().slice(0, 7);
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (order.total || 0);
  });

  // Outstanding payments
  const unpaidOrders = orders.filter(o => 
    ['غير مدفوع', 'معلق', 'مدفوع جزئياً'].includes(o.payment_status)
  );
  const outstandingAmount = unpaidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    overview: {
      totalRevenue,
      totalDiscount,
      totalTax,
      netRevenue: totalRevenue - totalDiscount,
      subscriptionRevenue,
      recurringMRR,
      totalOrders: paidOrders.length,
      avgOrderValue: totalRevenue / (paidOrders.length || 1),
      outstandingAmount,
      unpaidOrdersCount: unpaidOrders.length
    },
    revenueByService: Object.entries(revenueByService)
      .map(([name, data]) => ({ serviceName: name, ...data }))
      .sort((a, b) => b.revenue - a.revenue),
    paymentMethods,
    monthlyRevenue: Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    profitAnalysis: {
      estimatedTotalProfit: Object.values(revenueByService).reduce((sum, s) => sum + s.estimatedProfit, 0),
      avgProfitMargin: 60 // Industry standard for cleaning services
    }
  };
}

function generateMarketingReport(campaigns, orders) {
  const campaignPerformance = campaigns.map(campaign => {
    // Calculate ROI based on campaign type and orders generated
    const campaignOrders = orders.filter(o => 
      o.created_date > campaign.created_date &&
      o.discount > 0 // Assuming orders with discounts came from campaigns
    );

    const revenue = campaignOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const estimatedCost = (campaign.sent_count || 0) * 0.5; // Estimated 0.5 AED per message
    const roi = estimatedCost > 0 ? ((revenue - estimatedCost) / estimatedCost * 100) : 0;

    return {
      campaignId: campaign.id,
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      sent: campaign.sent_count || 0,
      openRate: campaign.open_rate || 0,
      conversionRate: campaign.conversion_rate || 0,
      revenue,
      estimatedCost,
      roi: roi.toFixed(2),
      ordersGenerated: campaignOrders.length
    };
  });

  // Overall marketing metrics
  const totalSent = campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
  const avgOpenRate = campaigns.reduce((sum, c) => sum + (c.open_rate || 0), 0) / (campaigns.length || 1);
  const avgConversionRate = campaigns.reduce((sum, c) => sum + (c.conversion_rate || 0), 0) / (campaigns.length || 1);
  const totalRevenue = campaignPerformance.reduce((sum, c) => sum + c.revenue, 0);
  const totalCost = campaignPerformance.reduce((sum, c) => sum + c.estimatedCost, 0);
  const overallROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost * 100) : 0;

  // Campaign type analysis
  const typeAnalysis = {};
  campaigns.forEach(campaign => {
    const type = campaign.type || 'other';
    if (!typeAnalysis[type]) {
      typeAnalysis[type] = {
        count: 0,
        totalSent: 0,
        avgConversion: 0,
        totalRevenue: 0
      };
    }
    typeAnalysis[type].count += 1;
    typeAnalysis[type].totalSent += campaign.sent_count || 0;
    typeAnalysis[type].avgConversion += campaign.conversion_rate || 0;
  });

  Object.keys(typeAnalysis).forEach(type => {
    const data = typeAnalysis[type];
    data.avgConversion = data.avgConversion / data.count;
  });

  return {
    overview: {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalMessagesSent: totalSent,
      avgOpenRate: avgOpenRate.toFixed(2),
      avgConversionRate: avgConversionRate.toFixed(2),
      totalRevenue,
      totalCost,
      overallROI: overallROI.toFixed(2)
    },
    campaignPerformance: campaignPerformance.sort((a, b) => b.roi - a.roi),
    typeAnalysis,
    topPerformers: campaignPerformance
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5)
  };
}

function generateOperationalReport(orders, workers, services, reviews, clients) {
  // Service efficiency
  const serviceEfficiency = {};
  orders.forEach(order => {
    const serviceName = order.service_name || 'غير محدد';
    if (!serviceEfficiency[serviceName]) {
      serviceEfficiency[serviceName] = {
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        avgCompletionTime: 0,
        totalRevenue: 0
      };
    }
    serviceEfficiency[serviceName].totalOrders += 1;
    if (order.status === 'مكتمل') serviceEfficiency[serviceName].completedOrders += 1;
    if (order.status === 'ملغي') serviceEfficiency[serviceName].cancelledOrders += 1;
    serviceEfficiency[serviceName].totalRevenue += order.total || 0;
  });

  Object.keys(serviceEfficiency).forEach(serviceName => {
    const data = serviceEfficiency[serviceName];
    data.completionRate = ((data.completedOrders / data.totalOrders) * 100).toFixed(1);
    data.cancellationRate = ((data.cancelledOrders / data.totalOrders) * 100).toFixed(1);
  });

  // Worker productivity
  const workerProductivity = workers.map(worker => {
    const workerOrders = orders.filter(o => o.worker_id === worker.id);
    const completedOrders = workerOrders.filter(o => o.status === 'مكتمل');
    const workerReviews = reviews.filter(r => r.worker_id === worker.id);
    const avgRating = workerReviews.length > 0 
      ? workerReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / workerReviews.length 
      : 0;

    return {
      workerId: worker.id,
      name: worker.name,
      specialty: worker.specialty,
      totalOrders: workerOrders.length,
      completedOrders: completedOrders.length,
      completionRate: workerOrders.length > 0 ? ((completedOrders.length / workerOrders.length) * 100).toFixed(1) : 0,
      avgRating: avgRating.toFixed(1),
      totalReviews: workerReviews.length,
      status: worker.status
    };
  });

  // Customer satisfaction trends
  const satisfactionByMonth = {};
  reviews.forEach(review => {
    const month = new Date(review.created_date).toISOString().slice(0, 7);
    if (!satisfactionByMonth[month]) {
      satisfactionByMonth[month] = { total: 0, count: 0, avg: 0 };
    }
    satisfactionByMonth[month].total += review.rating || 0;
    satisfactionByMonth[month].count += 1;
  });

  Object.keys(satisfactionByMonth).forEach(month => {
    const data = satisfactionByMonth[month];
    data.avg = (data.total / data.count).toFixed(2);
  });

  // Customer retention
  const repeatCustomers = clients.filter(c => (c.total_orders || 0) > 1).length;
  const retentionRate = clients.length > 0 ? ((repeatCustomers / clients.length) * 100).toFixed(1) : 0;

  // Order status distribution
  const statusDistribution = {};
  orders.forEach(order => {
    const status = order.status || 'غير محدد';
    statusDistribution[status] = (statusDistribution[status] || 0) + 1;
  });

  return {
    overview: {
      totalWorkers: workers.length,
      activeWorkers: workers.filter(w => w.status === 'متاح').length,
      avgServiceRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(2)
        : 0,
      totalReviews: reviews.length,
      customerRetentionRate: retentionRate,
      repeatCustomers
    },
    serviceEfficiency: Object.entries(serviceEfficiency)
      .map(([name, data]) => ({ serviceName: name, ...data }))
      .sort((a, b) => b.totalOrders - a.totalOrders),
    workerProductivity: workerProductivity.sort((a, b) => b.completedOrders - a.completedOrders),
    satisfactionTrends: Object.entries(satisfactionByMonth)
      .map(([month, data]) => ({ month, avgRating: data.avg, reviewCount: data.count }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    statusDistribution,
    topPerformers: workerProductivity
      .filter(w => w.completedOrders > 0)
      .sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating))
      .slice(0, 5)
  };
}