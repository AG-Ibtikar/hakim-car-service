import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {
  FaHome,
  FaClipboardList,
  FaCog,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUserShield,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import styles from '../styles/AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('hakim_auth_token');
    const adminData = Cookies.get('admin_user');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // If we have admin data in cookies, use it
    if (adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (error) {
        console.error('Error parsing admin data:', error);
        router.push('/admin/login');
        return;
      }
    } else {
      // If no admin data in cookies, try to get from localStorage (fallback)
      const localAdminData = localStorage.getItem('adminUser');
      if (localAdminData) {
        try {
          const adminUser = JSON.parse(localAdminData);
          setAdmin(adminUser);
          // Store in cookies for consistency
          Cookies.set('admin_user', localAdminData, { expires: 7 });
        } catch (error) {
          console.error('Error parsing local admin data:', error);
          router.push('/admin/login');
          return;
        }
      } else {
        router.push('/admin/login');
        return;
      }
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    // Clear cookies
    Cookies.remove('hakim_auth_token');
    Cookies.remove('admin_user');
    
    // Clear localStorage as well
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaHome />,
      path: '/admin/dashboard'
    },
    {
      title: 'Request Management',
      icon: <FaClipboardList />,
      path: '/admin/requests',
      subItems: [
        { title: 'Assign Requests', path: '/admin/requests/assign' },
        { title: 'Live Requests', path: '/admin/requests/live' },
        { title: 'Track Drivers', path: '/admin/requests/tracking' }
      ]
    },
    {
      title: 'System Configuration',
      icon: <FaCog />,
      path: '/admin/config',
      subItems: [
        { title: 'Manage Brands', path: '/admin/config/brands' },
        { title: 'Configure Services', path: '/admin/config/services' },
        { title: 'Set Pricing', path: '/admin/config/pricing' },
        { title: 'Define Warranties', path: '/admin/config/warranties' },
        { title: 'Establish SLAs', path: '/admin/config/slas' }
      ]
    },
    {
      title: 'Operations Management',
      icon: <FaExclamationTriangle />,
      path: '/admin/operations',
      subItems: [
        { title: 'Escalations', path: '/admin/operations/escalations' },
        { title: 'Exceptions', path: '/admin/operations/exceptions' },
        { title: 'Support Communications', path: '/admin/operations/support' }
      ]
    },
    {
      title: 'Financial Management',
      icon: <FaMoneyBillWave />,
      path: '/admin/finance',
      subItems: [
        { title: 'Garage Commissions', path: '/admin/finance/commissions' },
        { title: 'Settlement Reports', path: '/admin/finance/reports' }
      ]
    },
    {
      title: 'System Administration',
      icon: <FaUserShield />,
      path: '/admin/system',
      subItems: [
        { title: 'Audit Logs', path: '/admin/system/audit' },
        { title: 'Performance Metrics', path: '/admin/system/metrics' },
        { title: 'Conflict Resolution', path: '/admin/system/conflicts' },
        { title: 'User Access', path: '/admin/system/users' },
        { title: 'System Settings', path: '/admin/system/settings' }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{title} | Hakim Admin</title>
      </Head>

      <div className={styles.container}>
        {/* Sidebar Toggle Button */}
        <button
          className={styles.sidebarToggle}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarHeader}>
            <h1>Hakim Admin</h1>
          </div>

          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <div key={item.path} className={styles.menuItem}>
                <Link href={item.path} className={styles.menuLink}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
                {item.subItems && (
                  <div className={styles.subItems}>
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className={styles.subItem}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <header className={styles.header}>
            <h2>{title}</h2>
            <div className={styles.userInfo}>
              <span>{admin.email}</span>
            </div>
          </header>

          <div className={styles.content}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
} 