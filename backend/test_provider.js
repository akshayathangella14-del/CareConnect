const http = require('http');

async function runTest() {
  try {
    // 1. Register new provider
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Provider',
        email: 'testprov' + Date.now() + '@example.com',
        password: 'Password123!',
        phone: '9876543210',
        role: 'SERVICE_PROVIDER'
      })
    });
    const regData = await regRes.json();
    console.log('Register:', regRes.status, regData);
    
    if (!regData.data || !regData.data.token) {
      console.log('Failed to register, aborting');
      return;
    }
    
    const token = regData.data.token;
    
    // 2. Get profile
    const getRes = await fetch('http://localhost:5000/api/providers/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Get Profile 1:', getRes.status, await getRes.json());
    
    // 3. Update profile
    const patchRes = await fetch('http://localhost:5000/api/providers/me', {
      method: 'PATCH',
      headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName: 'Updated Test Provider',
        bio: 'This is a test bio',
        experienceYears: 5,
        skills: [],
        serviceAreas: [{ city: 'Hyderabad', state: 'Telangana', label: 'Hyderabad' }]
      })
    });
    console.log('Update Profile:', patchRes.status, await patchRes.json());
    
    // 4. Get profile again
    const getRes2 = await fetch('http://localhost:5000/api/providers/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Get Profile 2:', getRes2.status, await getRes2.json());
    
  } catch (err) {
    console.error(err);
  }
}
runTest();
