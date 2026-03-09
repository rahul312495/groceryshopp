import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { api } from '../context/AuthContext.jsx';
import styles from './DashboardPage.module.css';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Processing: '#8b5cf6',
  Shipped: '#06b6d4',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
};

const PIE_COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#4ade80', '#86efac', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, rv, cat, os] = await Promise.all([
          api.get('/stats/overview'),
          api.get('/stats/revenue'),
          api.get('/stats/categories'),
          api.get('/stats/order-status'),
        ]);
        setOverview(ov.data);
        setRevenue(rv.data);
        setCategories(cat.data.map(c => ({ name: c._id, revenue: c.revenue, sold: c.itemsSold })));
        setOrderStatus(os.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
    </div>
  );

  const statCards = [
    { label: 'Total Revenue', value: `$${overview?.totalRevenue?.toFixed(2) || '0.00'}`, icon: '💰', color: '#22c55e', bg: '#f0fdf4' },
    { label: 'Total Orders', value: overview?.totalOrders || 0, icon: '📦', color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Customers', value: overview?.totalCustomers || 0, icon: '👥', color: '#8b5cf6', bg: '#f3e8ff' },
    { label: 'Products', value: overview?.totalProducts || 0, icon: '🛍️', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Pending Orders', value: overview?.pendingOrders || 0, icon: '⏳', color: '#ef4444', bg: '#fee2e2' },
    { label: 'Low Stock Items', value: overview?.lowStockProducts || 0, icon: '⚠️', color: '#d97706', bg: '#fef3c7' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's what's happening at FreshMart.</p>
        </div>
        <div className={styles.dateTag}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {statCards.map((s) => (
          <div key={s.label} className={styles.statCard} style={{ '--card-color': s.color, '--card-bg': s.bg }}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard} style={{ flex: 2 }}>
          <div className={styles.chartHeader}>
            <h3>Revenue & Orders — Last 7 Days</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
                formatter={(v, name) => [name === 'revenue' ? `$${v.toFixed(2)}` : v, name === 'revenue' ? 'Revenue' : 'Orders']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className={styles.chartCard} style={{ flex: 1 }}>
          <div className={styles.chartHeader}><h3>Order Status</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={orderStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                {orderStatus.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name) => [v, name]} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}><h3>Revenue by Category</h3></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={categories} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
              formatter={(v, name) => [name === 'revenue' ? `$${v.toFixed(2)}` : v, name === 'revenue' ? 'Revenue' : 'Units Sold']}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {categories.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
