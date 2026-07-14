const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateCartTotal, formatCurrency } = require('../src/cart');

test('calculates total for a cart with multiple quantities', () => {
  const cart = [
    { id: 1, price: 18000, quantity: 2 },
    { id: 2, price: 25000, quantity: 1 }
  ];

  assert.equal(calculateCartTotal(cart), 61000);
});

test('formats prices as RWF currency', () => {
  assert.equal(formatCurrency(18000), 'RWF 18,000');
});
