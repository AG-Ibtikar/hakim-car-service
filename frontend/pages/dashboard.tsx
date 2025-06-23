import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import { FaCar, FaHistory, FaMapMarkerAlt, FaShieldAlt, FaHome, FaCog, FaBell } from 'react-icons/fa';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    console.log('Dashboard: Checking authentication...');
    
    const checkAuth = () => {
      // Check for both admin and regular user tokens
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      const regularToken = localStorage.getItem('token');
      const regularUser = localStorage.getItem('user');
      
      console.log('Dashboard: localStorage contents:', {
        adminToken: adminToken ? 'present' : 'missing',
        adminUser: adminUser ? 'present' : 'missing',
        regularToken: regularToken ? 'present' : 'missing',
        regularUser: regularUser ? 'present' : 'missing'
      });
      
      // Use admin data if available, otherwise use regular data
      const token = adminToken || regularToken;
      const userData = adminUser || regularUser;
      
      if (!token || !userData) {
        console.log('Dashboard: No authentication data found, redirecting to login');
        router.push('/auth/login/customer');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        console.log('Dashboard: User data loaded successfully:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Dashboard: Error parsing user data:', error);
        router.push('/auth/login/customer');
      }
    };

    // Check immediately
    checkAuth();
    
    // Also check after a short delay in case data is still being set
    const timeoutId = setTimeout(checkAuth, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [router]);

  const handleProfileUpdate = async (data: any) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      // Update both admin and regular user storage
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    }
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', active: activeTab === 'dashboard' },
    { icon: <FaCar />, label: 'My Vehicles', active: activeTab === 'vehicles' },
    { icon: <FaMapMarkerAlt />, label: 'Book Service', active: activeTab === 'book' },
    { icon: <FaHistory />, label: 'Service History', active: activeTab === 'history' },
    { icon: <FaShieldAlt />, label: 'Warranties', active: activeTab === 'warranties' },
    { icon: <FaCog />, label: 'Settings', active: activeTab === 'settings' },
    { icon: <FaBell />, label: 'Notifications', active: activeTab === 'notifications' },
  ];

  const quickActions = [
    {
      icon: <FaCar />,
      title: 'My Vehicles',
      description: 'Manage your registered vehicles',
      onClick: () => router.push('/my-vehicles'),
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Book a Service',
      description: 'Schedule a new service appointment',
      onClick: () => router.push('/services'),
    },
    {
      icon: <FaHistory />,
      title: 'Service History',
      description: 'View your past service records',
      onClick: () => router.push('/history'),
    },
    {
      icon: <FaShieldAlt />,
      title: 'Warranties',
      description: 'Check your service warranties',
      onClick: () => router.push('/warranties'),
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard | Hakim Car Service</title>
        <meta name="description" content="Manage your car services and bookings" />
      </Head>

      <DashboardLayout title="Dashboard">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Welcome back, {user.firstName}!</h1>
            <p className={styles.subtitle}>Here's what's happening with your vehicles today.</p>
          </div>

          <div className={styles.quickActionsSection}>
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
          </div>

          <div className={styles.recentActivitySection}>
            <h2>Recent Activity</h2>
            <div className={styles.activityCard}>
              <div className={styles.noActivity}>
                <p>No recent activity to show</p>
                <button className={styles.browseButton} onClick={() => router.push('/services')}>
                  Browse Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
} 