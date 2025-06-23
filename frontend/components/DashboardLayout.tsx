import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { FaHome, FaCar, FaHistory, FaMapMarkerAlt, FaShieldAlt, FaCog, FaBell, FaSignOutAlt } from 'react-icons/fa';
import styles from '../styles/DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const router = useRouter();

  const handleSignOut = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Clear cookies
    if (typeof window !== 'undefined') {
      document.cookie = 'hakim_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'admin_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    // Redirect to login page
    router.push('/auth/login/customer');
  };

  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaCar />, label: 'My Vehicles', path: '/my-vehicles' },
    { icon: <FaMapMarkerAlt />, label: 'Book Service', path: '/services' },
    { icon: <FaHistory />, label: 'Service History', path: '/history' },
    { icon: <FaShieldAlt />, label: 'Warranties', path: '/warranties' },
    { icon: <FaCog />, label: 'Settings', path: '/settings' },
    { icon: <FaBell />, label: 'Notifications', path: '/notifications' },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.appName}>
          <h1>Hakim</h1>
          <p>Car Service</p>
        </div>
        <nav className={styles.navigation}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${router.pathname === item.path ? styles.active : ''}`}
              onClick={() => router.push(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
          <button
            className={`${styles.navItem} ${styles.signOutButton}`}
            onClick={handleSignOut}
          >
            <span className={styles.navIcon}><FaSignOutAlt /></span>
            <span className={styles.navLabel}>Sign Out</span>
          </button>
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h2>{title}</h2>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
} 