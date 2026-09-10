const { app, db } = require('./server');

const server = app.listen(0, async () => {
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const createRes = await fetch(`${base}/admin/products`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'name=Debug%20Product&category=Test&price=15000&description=Debug&image=/images/test.jpg&pass=glowluxe2026'
  });
  console.log('create status', createRes.status, createRes.url);

  const row = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM products WHERE name = ?', ['Debug Product'], (err, row) => err ? reject(err) : resolve(row));
  });
  console.log('row', row);

  const deleteRes = await fetch(`${base}/admin/products/${row.id}/delete`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'pass=glowluxe2026'
  });
  console.log('delete status', deleteRes.status, deleteRes.url);
  console.log(await deleteRes.text());
  server.close();
});
