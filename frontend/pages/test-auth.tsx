import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TestAuth() {
  const router = useRouter();
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      const regularToken = localStorage.getItem('token');
      const regularUser = localStorage.getItem('user');
      
      const data = {
        adminToken: adminToken ? 'present' : 'missing',
        adminUser: adminUser ? 'present' : 'missing',
        regularToken: regularToken ? 'present' : 'missing',
        regularUser: regularUser ? 'present' : 'missing',
        adminUserData: adminUser ? JSON.parse(adminUser) : null,
        regularUserData: regularUser ? JSON.parse(regularUser) : null
      };
      
      setAuthData(data);
      console.log('Auth data:', data);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthData(null);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Authentication Test Page</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => router.push('/auth/login/customer')}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '1rem',
            background: '#FFD700',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Customer Login
        </button>
        
        <button 
          onClick={() => router.push('/dashboard')}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '1rem',
            background: '#3498DB',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          Go to Dashboard
        </button>
        
        <button 
          onClick={clearAuth}
          style={{ 
            padding: '0.5rem 1rem',
            background: '#E74C3C',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          Clear Auth Data
        </button>
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>Current Authentication Data:</h3>
        <pre style={{ 
          background: '#fff', 
          padding: '1rem', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {JSON.stringify(authData, null, 2)}
        </pre>
      </div>
    </div>
  );
} 