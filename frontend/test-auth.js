// Test script to verify admin authentication flow
const axios = require('axios');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

async function testAdminAuth() {
  try {
    console.log('🧪 Testing Admin Authentication Flow...\n');

    // Step 1: Test login API
    console.log('1. Testing login API...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login/admin`, {
      email: 'admin@hakim.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    console.log('Token:', loginResponse.data.access_token.substring(0, 50) + '...');
    console.log('User:', loginResponse.data.user.email);
    console.log('Role:', loginResponse.data.user.role);

    // Step 2: Test dashboard access with token
    console.log('\n2. Testing dashboard access...');
    const dashboardResponse = await axios.get(`${FRONTEND_URL}/admin/dashboard`, {
      headers: {
        'Cookie': `hakim_auth_token=${loginResponse.data.access_token}`
      }
    });
    
    console.log('✅ Dashboard accessible');
    console.log('Status:', dashboardResponse.status);

    console.log('\n🎉 All tests passed! Admin authentication is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAdminAuth(); 