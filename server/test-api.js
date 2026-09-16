const http = require('http');

const request = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Starting API Verification Suite...\n');

  // 1. Health check
  const health = await request('GET', '/health');
  console.log('1. Health Check:', health.status === 200 ? '✅ PASS' : '❌ FAIL', health.data.status);

  // 2. GET all contacts
  const allContacts = await request('GET', '/contacts');
  console.log('2. GET /contacts:', allContacts.status === 200 ? '✅ PASS' : '❌ FAIL', `Total count: ${allContacts.data.count}`);
  const sampleId = allContacts.data.data[0]._id;

  // 3. GET single contact
  const single = await request('GET', `/contacts/${sampleId}`);
  console.log('3. GET /contacts/:id:', single.status === 200 ? '✅ PASS' : '❌ FAIL', `Name: ${single.data.data.name}`);

  // 4. Invalid ObjectId
  const invalidId = await request('GET', '/contacts/invalid-id-format');
  console.log('4. Invalid ID rejection (400):', invalidId.status === 400 ? '✅ PASS' : '❌ FAIL', invalidId.data.message);

  // 5. Validation failure on POST (missing fields & bad email)
  const badPost = await request('POST', '/contacts', { name: 'A', email: 'not-an-email', phone: '' });
  console.log('5. Validation failure rejection (400):', badPost.status === 400 ? '✅ PASS' : '❌ FAIL', Object.keys(badPost.data.errors || {}));

  // 6. Duplicate email rejection (409)
  const duplicate = await request('POST', '/contacts', {
    name: 'Duplicate Arthur',
    email: 'arthur.pendelton@vintagebinding.com',
    phone: '+1 (555) 111-2222',
  });
  console.log('6. Duplicate email rejection (409):', duplicate.status === 409 ? '✅ PASS' : '❌ FAIL', duplicate.status, duplicate.data);

  // 7. Toggle favorite
  const favorite = await request('PATCH', `/contacts/${sampleId}/favorite`);
  console.log('7. PATCH /favorite toggle:', favorite.status === 200 ? '✅ PASS' : '❌ FAIL', favorite.data.message);

  // 8. PUT update contact
  const update = await request('PUT', `/contacts/${sampleId}`, {
    name: 'Arthur Pendelton (Master)',
    email: 'arthur.pendelton@vintagebinding.com',
    phone: '+1 (555) 234-8901',
    company: 'Pendelton Rare Books & Fine Binding',
    tags: ['Work', 'VIP', 'Master-Craftsman'],
  });
  console.log('8. PUT update contact:', update.status === 200 ? '✅ PASS' : '❌ FAIL', update.status, update.data);

  // 9. Tags aggregation
  const tags = await request('GET', '/contacts/tags/all');
  console.log('9. GET /tags/all:', tags.status === 200 ? '✅ PASS' : '❌ FAIL', `Found ${tags.data.data.length} distinct tags`);

  // 10. DELETE contact
  const toDelete = await request('POST', '/contacts', {
    name: 'Temporary Contact',
    email: 'temp.contact@example.com',
    phone: '+1 (555) 000-0000',
  });
  const deleteRes = await request('DELETE', `/contacts/${toDelete.data.data._id}`);
  console.log('10. DELETE /contacts/:id:', deleteRes.status === 200 ? '✅ PASS' : '❌ FAIL', deleteRes.data.message);

  console.log('\n🎉 ALL 10 REST API TESTS COMPLETED!');
}

runTests().catch(console.error);
