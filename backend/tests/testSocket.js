// ============================================================
//  Socket.io Emergency Alert — Integration Test
//  Run:  node tests/testSocket.js
// ============================================================

const { io } = require('socket.io-client');
const http = require('http');

const BASE = 'http://localhost:5000';

// ---- helpers ----

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(path, BASE);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
    };
    const req = http.request(opts, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        try { resolve(JSON.parse(chunks)); } catch { resolve(chunks); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ---- main ----

(async () => {
  console.log('=== LifeLink Socket.io Emergency Alert Test ===\n');

  // 1. Login as donor (already registered earlier)
  console.log('1. Logging in as donor (Alice Johnson)...');
  const donorAuth = await post('/api/auth/login', {
    email: 'alice.johnson@email.com',
    password: 'Donor@456',
  });
  if (!donorAuth.success) {
    console.error('   Donor login failed:', donorAuth.message);
    process.exit(1);
  }
  const donorToken = donorAuth.data.token;
  console.log('   ✅ Donor authenticated\n');

  // 2. Login as hospital
  console.log('2. Logging in as hospital (City General Hospital)...');
  const hospAuth = await post('/api/auth/login', {
    email: 'notify@citygeneral.com',
    password: 'Hospital@456',
  });
  if (!hospAuth.success) {
    console.error('   Hospital login failed:', hospAuth.message);
    process.exit(1);
  }
  const hospToken = hospAuth.data.token;
  console.log('   ✅ Hospital authenticated\n');

  // 3. Connect donor socket with JWT
  console.log('3. Connecting donor socket with JWT auth...');
  const donorSocket = io(BASE, {
    auth: { token: donorToken },
    transports: ['websocket'],
  });

  await new Promise((resolve, reject) => {
    donorSocket.on('connected', (data) => {
      console.log('   ✅ Socket connected:', data.message);
      console.log(`      userId=${data.userId}, role=${data.role}\n`);
      resolve();
    });
    donorSocket.on('connect_error', (err) => {
      console.error('   ❌ Socket connection error:', err.message);
      reject(err);
    });
    setTimeout(() => reject(new Error('Socket connection timeout')), 5000);
  });

  // 4. Listen for emergency alert
  console.log('4. Waiting for emergency-blood-request event...');
  const alertPromise = new Promise((resolve) => {
    donorSocket.on('emergency-blood-request', (payload) => {
      console.log('   🚨 EMERGENCY ALERT RECEIVED!');
      console.log('   Payload:', JSON.stringify(payload, null, 2));
      resolve(payload);
    });
  });

  // 5. Hospital creates an EMERGENCY blood request
  console.log('5. Hospital creating EMERGENCY blood request (A+ in Mumbai)...');
  const reqResult = await post(
    '/api/request/create',
    {
      bloodGroup: 'A+',
      unitsRequired: 3,
      patientName: 'Critical Patient',
      hospitalName: 'City General Hospital',
      city: 'Mumbai',
      state: 'Maharashtra',
      urgency: 'emergency',
      notes: 'Socket.io test — emergency',
    },
    { Authorization: `Bearer ${hospToken}` }
  );

  if (!reqResult.success) {
    console.error('   ❌ Blood request creation failed:', reqResult.message);
    donorSocket.disconnect();
    process.exit(1);
  }
  console.log(`   ✅ Blood request created — matched ${reqResult.data.matchedCount} donor(s)\n`);

  // 6. Wait for the alert (with timeout)
  const alert = await Promise.race([
    alertPromise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timed out waiting for emergency alert')), 5000)),
  ]).catch((err) => {
    console.error('   ❌', err.message);
    return null;
  });

  // 7. Verify
  if (alert) {
    console.log('\n=== RESULT ===');
    console.log('✅ Emergency alert delivered in real-time!');
    console.log(`   Blood Group : ${alert.bloodGroup}`);
    console.log(`   City        : ${alert.city}`);
    console.log(`   Hospital    : ${alert.hospitalName}`);
    console.log(`   Units       : ${alert.unitsRequired}`);
    console.log(`   Urgency     : ${alert.urgency}`);
  } else {
    console.log('\n=== RESULT ===');
    console.log('❌ Emergency alert NOT received within timeout.');
  }

  // Cleanup
  donorSocket.disconnect();
  console.log('\nSocket disconnected. Test complete.');
  process.exit(0);
})();
