function getServerConfig() {
  return {
    port: Number(process.env.PORT || 3000),
    sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret-change-me',
    adminPassword: process.env.ADMIN_PASSWORD || 'glowluxe2026',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: Number(process.env.SMTP_PORT || 465),
    smtpSecure: process.env.SMTP_SECURE !== 'false',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    currency: process.env.CURRENCY || 'rwf'
  };
}

module.exports = { getServerConfig };
