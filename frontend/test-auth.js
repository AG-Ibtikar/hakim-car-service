// Test script to verify admin authentication flow
const axios = require('axios');

async function testAdminAuth() {
  try {
    console.log('🧪 Testing Admin Authentication Flow...\n');

    // Step 1: Test login API
    console.log('1. Testing login API...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login/admin', {
      email: 'admin@hakim.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    console.log('Token:', loginResponse.data.access_token.substring(0, 50) + '...');
    console.log('User:', loginResponse.data.user.email);
    console.log('Role:', loginResponse.data.user.role);

    // Step 2: Test dashboard access with token
    console.log('\n2. Testing dashboard access...');
    const dashboardResponse = await axios.get('http://localhost:3000/admin/dashboard', {
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