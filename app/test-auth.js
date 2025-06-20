const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// Test user data
const testUser = {
    email: 'test@example.com',
    userName: 'Test User',
    password: 'password123'
};

let authToken = null;

async function testAuth() {
    console.log('🧪 Testing Authentication API...\n');

    try {
        // Test 1: Sign Up
        console.log('1. Testing Sign Up...');
        const signUpResponse = await axios.post(`${API_BASE_URL}/auth/sign-up`, testUser);
        console.log('✅ Sign Up successful:', signUpResponse.data.message);
        authToken = signUpResponse.data.token;
        console.log('Token received:', authToken ? 'Yes' : 'No');
        console.log('');

        // Test 2: Sign In
        console.log('2. Testing Sign In...');
        const signInResponse = await axios.post(`${API_BASE_URL}/auth/sign-in`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Sign In successful:', signInResponse.data.message);
        authToken = signInResponse.data.token;
        console.log('');

        // Test 3: Get Profile
        console.log('3. Testing Get Profile...');
        const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log('✅ Get Profile successful:', profileResponse.data.user);
        console.log('');

        // Test 4: Update Profile
        console.log('4. Testing Update Profile...');
        const updateResponse = await axios.put(`${API_BASE_URL}/auth/profile`, {
            userName: 'Updated Test User'
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log('✅ Update Profile successful:', updateResponse.data.message);
        console.log('');

        // Test 5: Logout
        console.log('5. Testing Logout...');
        const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log('✅ Logout successful:', logoutResponse.data.message);
        console.log('');

        console.log('🎉 All tests passed! Authentication system is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
    }
}

// Run the test
testAuth(); 