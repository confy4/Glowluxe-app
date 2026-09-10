const test = require('node:test');
const assert = require('node:assert/strict');

const { app, db, appReady } = require('../server');
const { getServerConfig } = require('../src/config');

const ADMIN_PASSWORD = getServerConfig().adminPassword;

function waitForDbGet(query, params) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

test('admin can add and delete products', async () => {
  await appReady;
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const createResponse = await fetch(`${baseUrl}/admin/products`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      redirect: 'manual',
      body: `name=Test%20Product&category=Test&price=15000&description=Test%20Desc&image=/images/test.jpg&pass=${encodeURIComponent(ADMIN_PASSWORD)}`
    });

    assert.equal(createResponse.status, 302);

    const created = await waitForDbGet('SELECT * FROM products WHERE name = ?', ['Test Product']);
    assert.ok(created, 'product should be created');

    const deleteResponse = await fetch(`${baseUrl}/admin/products/${created.id}/delete`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      redirect: 'manual',
      body: `pass=${encodeURIComponent(ADMIN_PASSWORD)}`
    });

    assert.equal(deleteResponse.status, 302);

    const deleted = await waitForDbGet('SELECT * FROM products WHERE id = ?', [created.id]);
    assert.equal(deleted, undefined);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});
