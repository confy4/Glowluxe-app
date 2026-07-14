function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatCurrency(value) {
  return `RWF ${value.toLocaleString('en-RW')}`;
}

module.exports = { calculateCartTotal, formatCurrency };
