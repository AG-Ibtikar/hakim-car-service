import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Dashboard.module.css';
import { FiHome, FiCalendar, FiMap, FiClock, FiShield } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const router = useRouter();

  const quickActions = [
    {
      icon: <FiCalendar />,
      title: 'Book Service',
      description: 'Schedule a new service appointment',
      onClick: () => router.push('/services'),
    },
    {
      icon: <FiMap />,
      title: 'Track Service',
      description: 'Monitor your ongoing service status',
      onClick: () => router.push('/tracking'),
    },
    {
      icon: <FiClock />,
      title: 'Service History',
      description: 'View your past service records',
      onClick: () => router.push('/history'),
    },
    {
      icon: <FiShield />,
      title: 'Warranties',
      description: 'Manage your service warranties',
      onClick: () => router.push('/warranties'),
    },
  ];

  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', active: true },
    { icon: <FiCalendar />, label: 'Book Service' },
    { icon: <FiMap />, label: 'Track Service' },
    { icon: <FiClock />, label: 'Service History' },
    { icon: <FiShield />, label: 'Warranties' },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Navigation */}
      <nav className={styles.topNav}>
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`${styles.navItem} ${item.active ? styles.active : ''}`}
            onClick={() => item.label !== 'Dashboard' && router.push(`/${item.label.toLowerCase().replace(' ', '-')}`)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <section className={styles.welcomeSection}>
          <h1>Welcome to Your Dashboard</h1>
          <p>Manage your car services and track their progress</p>
        </section>

        <section className={styles.quickActionsSection}>
          <h2>Quick Actions</h2>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <div key={index} className={styles.actionCard} onClick={action.onClick}>
                <div className={styles.actionIconWrapper}>
                  {action.icon}
                </div>
                <div className={styles.actionContent}>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.recentActivitySection}>
          <h2>Recent Activity</h2>
          <div className={styles.activityCard}>
            <div className={styles.noActivity}>
              <p>No recent activity to show</p>
              <button className={styles.browseButton} onClick={() => router.push('/services')}>
                Browse Services
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard; 