const http = require('http');

const data = JSON.stringify({
  name: 'Test Node',
  email: 'node@test.com',
  password: 'password123',
  password_confirmation: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
