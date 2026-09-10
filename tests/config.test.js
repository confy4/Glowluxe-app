const test = require('node:test');
const assert = require('node:assert/strict');

const { getServerConfig } = require('../src/config');

test('loads server config from environment variables', () => {
  process.env.PORT = '4000';
  process.env.SESSION_SECRET = 'test-secret';
  process.env.ADMIN_PASSWORD = 'admin123';

  const config = getServerConfig();

  assert.equal(config.port, 4000);
  assert.equal(config.sessionSecret, 'test-secret');
  assert.equal(config.adminPassword, 'admin123');
});
