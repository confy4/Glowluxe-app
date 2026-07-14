const express = require('express');
const path = require('path');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const { calculateCartTotal, formatCurrency } = require('./src/cart');

const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'lotion-secret', resave: false, saveUninitialized: true }));

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

function initDb(callback) {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      total INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id)
    )`);

    db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
      if (!err && row.count === 0) {
        const seedProducts = [
          ['Glow Daily Lotion',            'Body Care', 18000, 'Soft daily hydration for smooth, glowing skin.',                    '/images/p1.webp'],
          ['Neem Relief Cream',            'Medicinal',  25000, 'Soothing herbal lotion made for sensitive skin.',                  '/images/p2.jpg'],
          ['Body Butter Texture Cream',    'Body Care', 22000, 'Rich body butter that melts into skin for lasting softness.',       '/images/p3.jpg'],
          ['Coconut Vanilla Lotion',       'Body Care', 24000, 'Tropical coconut and vanilla blend for irresistible soft skin.',    '/images/p4.webp'],
          ['Chanel Luxury Body Lotion',    'Luxury',    45000, 'Premium luxury lotion with an elegant long-lasting fragrance.',     '/images/p5.jpg'],
          ['Argan Glow Lotion',            'Luxury',    38000, 'Moroccan argan oil formula for deep nourishment and radiance.',     '/images/p6.jpg'],
          ['Aloe Vera Soothing Lotion',    'Medicinal',  20000, 'Pure aloe vera extract for instant cooling and skin healing.',     '/images/p7.jpg'],
          ['Jumbo Hydration Lotion',       'Body Care', 19000, 'Extra-large bottle of daily moisture for the whole family.',        '/images/p8.webp'],
          ['Rose Pink Glow Cream',         'Luxury',    32000, 'Delicate rose-pink formula for a soft, feminine glow.',            '/images/p9.jpg'],
          ['Sun Shield SPF 50 Lotion',     'Sun Care',  29000, 'High-protection SPF 50 lotion for all-day sun defense.',           '/images/p10.webp'],
          ['Gold Elixir Luxury Lotion',    'Luxury',    55000, '24K gold-infused lotion for ultimate skin radiance and anti-aging care.', '/images/skin1.webp'],
          ['Velvet Noir Body Cream',       'Luxury',    48000, 'Rich dark velvet cream with oud and musk for an indulgent skin experience.', '/images/skin2.webp']
        ];
        const stmt = db.prepare('INSERT INTO products (name, category, price, description, image) VALUES (?, ?, ?, ?, ?)');
        seedProducts.forEach((product) => stmt.run(product));
        stmt.finalize(callback);
      } else {
        callback();
      }
    });
  });
}

initDb(() => {

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.locals.formatCurrency = formatCurrency;
  next();
});

app.get('/', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id ASC', (err, products) => {
    if (err) return res.status(500).send('Database error');
    if (!products.length) return res.redirect('/');
    res.render('index', { products, cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0) });
  });
});

app.get('/product/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err || !product) return res.status(404).send('Product not found');
    res.render('product', { product, cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0) });
  });
});

app.post('/cart/add', (req, res) => {
  const productId = Number(req.body.productId);
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) return res.status(404).send('Product not found');
    const existing = req.session.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      req.session.cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    res.redirect('/cart');
  });
});

app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const total = calculateCartTotal(cart);
  res.render('cart', { cart, total, cartCount: cart.reduce((sum, item) => sum + item.quantity, 0) });
});

app.post('/cart/update', (req, res) => {
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity);
  req.session.cart = req.session.cart.filter((item) => {
    if (item.id === productId) {
      if (quantity > 0) item.quantity = quantity;
      return quantity > 0;
    }
    return true;
  });
  res.redirect('/cart');
});

app.post('/cart/remove', (req, res) => {
  const productId = Number(req.body.productId);
  req.session.cart = req.session.cart.filter((item) => item.id !== productId);
  res.redirect('/cart');
});

app.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect('/cart');
  res.render('checkout', { cart, total: calculateCartTotal(cart), cartCount: cart.reduce((sum, item) => sum + item.quantity, 0) });
});

app.post('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect('/cart');

  const { customerName, customerEmail, phone, address } = req.body;
  console.log('Sending email to:', customerEmail);
  const total = calculateCartTotal(cart);

  db.run('INSERT INTO orders (customer_name, customer_email, phone, address, total) VALUES (?, ?, ?, ?, ?)', [customerName, customerEmail, phone, address, total], function (err) {
    if (err) return res.status(500).send('Unable to save order');

    const orderId = this.lastID;
    const stmt = db.prepare('INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)');
    cart.forEach((item) => stmt.run(orderId, item.name, item.quantity, item.price));
    stmt.finalize();

    const now = new Date();
    const delivery = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const fmt = d => d.toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' }) +
      ' on ' + d.toLocaleDateString('en-RW', { weekday: 'long', month: 'long', day: 'numeric' });

    const itemRows = cart.map(i => `<tr><td style="padding:6px 12px">${i.name}</td><td style="padding:6px 12px">${i.quantity}</td><td style="padding:6px 12px">${formatCurrency(i.price * i.quantity)}</td></tr>`).join('');

    mailer.sendMail({
      from: '"GlowLuxe" <iradukundaconfiance35@gmail.com>',
      to: customerEmail,
      subject: `✦ Order Confirmed #${orderId} — GlowLuxe`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#4a3728">
          <div style="background:#7a3b2e;padding:24px;text-align:center">
            <h1 style="color:white;margin:0;font-size:1.6rem">✦ GlowLuxe</h1>
            <p style="color:#f6e6da;margin:6px 0 0">Premium Lotion Co. — Kigali, Rwanda</p>
          </div>
          <div style="padding:32px 24px">
            <h2 style="color:#7a3b2e">Thank you, ${customerName}! 🎉</h2>
            <p>Your order has been placed successfully. Here are your order details:</p>
            <div style="background:#fffaf7;border-radius:10px;padding:16px;margin:20px 0;border:1px solid #f0e6df">
              <p><strong>Order Number:</strong> #${orderId}</p>
              <p><strong>Order Time:</strong> ${fmt(now)}</p>
              <p><strong>Estimated Delivery:</strong> <span style="color:#1e7a45;font-weight:bold">${fmt(delivery)}</span></p>
              <p><strong>Delivery Address:</strong> ${address}</p>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              <thead><tr style="background:#f6e6da">
                <th style="padding:8px 12px;text-align:left">Product</th>
                <th style="padding:8px 12px;text-align:left">Qty</th>
                <th style="padding:8px 12px;text-align:left">Subtotal</th>
              </tr></thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="background:#7a3b2e;color:white;padding:14px 16px;border-radius:8px;font-size:1.1rem">
              <strong>Total: ${formatCurrency(total)}</strong>
            </div>
            <p style="margin-top:24px">Our team will contact you shortly to confirm your delivery. For any questions, reply to this email or call <strong>+250 791 591 773</strong>.</p>
          </div>
          <div style="background:#f6e6da;padding:16px;text-align:center;font-size:0.85rem;color:#9e7b6b">
            © 2025 GlowLuxe Lotion Co. All rights reserved.
          </div>
        </div>`
    }, (mailErr, info) => {
      if (mailErr) console.error('Email error:', mailErr.message);
      else console.log('Email sent to', customerEmail, info.response);
    });

    req.session.cart = [];
    res.render('confirmation', { orderId, total, cartCount: 0 });
  });
});

app.get('/about', (req, res) => res.render('about', { cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0) }));

app.get('/admin', (req, res) => {
  if (req.query.pass !== 'glowluxe2025') return res.status(401).render('unauthorized');
  const cartCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
  db.get('SELECT COUNT(*) AS count FROM orders', (err, r1) => {
    db.get('SELECT COALESCE(SUM(total),0) AS revenue FROM orders', (err, r2) => {
      db.get('SELECT COUNT(*) AS count FROM products', (err, r3) => {
        db.get('SELECT COALESCE(SUM(quantity),0) AS sold FROM order_items', (err, r4) => {
          db.all('SELECT product_name, SUM(quantity) AS total_qty, SUM(quantity*price) AS total_revenue FROM order_items GROUP BY product_name ORDER BY total_qty DESC LIMIT 5', (err, topProducts) => {
            db.all('SELECT * FROM orders ORDER BY id DESC LIMIT 10', (err, recentOrders) => {
              res.render('admin', {
                cartCount,
                totalOrders: r1.count,
                totalRevenue: r2.revenue,
                totalProducts: r3.count,
                totalItemsSold: r4.sold,
                topProducts: topProducts || [],
                recentOrders: recentOrders || []
              });
            });
          });
        });
      });
    });
  });
});

  app.listen(PORT, () => console.log(`Lotion commerce app running on http://localhost:${PORT}`));
});
