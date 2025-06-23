'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import {
  FaClipboardList,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUserShield,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import styles from '../../../styles/AdminDashboard.module.css';

interface DashboardStats {
  totalRequests: number;
  activeRequests: number;
  pendingEscalations: number;
  totalRevenue: number;
  activeTechnicians: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    activeRequests: 0,
    pendingEscalations: 0,
    totalRevenue: 0,
    activeTechnicians: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from the API
    setStats({
      totalRequests: 156,
      activeRequests: 23,
      pendingEscalations: 5,
      totalRevenue: 45678.90,
      activeTechnicians: 12
    });
  }, []);

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: <FaClipboardList />,
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Active Requests',
      value: stats.activeRequests,
      icon: <FaExclamationTriangle />,
      change: '-5%',
      trend: 'down'
    },
    {
      title: 'Pending Escalations',
      value: stats.pendingEscalations,
      icon: <FaExclamationTriangle />,
      change: '+2',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Active Technicians',
      value: stats.activeTechnicians,
      icon: <FaUserShield />,
      change: '+3',
      trend: 'up'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className={styles.grid}>
        {statCards.map((card) => (
          <div key={card.title} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}>{card.icon}</div>
              <div className={styles.trend}>
                <span className={styles.change}>
                  {card.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  {card.change}
                </span>
              </div>
            </div>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.value}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h3>Recent Activity</h3>
          <div className={styles.activityList}>
            <p className={styles.noActivity}>No recent activity</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Quick Actions</h3>
          <div className={styles.quickActions}>
            <button className={styles.actionButton}>
              Assign New Request
            </button>
            <button className={styles.actionButton}>
              View Escalations
            </button>
            <button className={styles.actionButton}>
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 