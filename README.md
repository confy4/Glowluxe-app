# ✦ GlowLuxe — Premium Lotion E-Commerce Web App

> **Course:** EWA408510 – E-Commerce and Web Application | Final Project
> **Student:** CONFIANCE Iradukunda
> **Instructor:** Eric Maniraguha
> **Academic Year:** 2025–2026

[![CI](https://github.com/confy4/Glowluxe-app/actions/workflows/ci.yml/badge.svg)](https://github.com/confy4/Glowluxe-app/actions/workflows/ci.yml)

---

## 🌐 Live Demo

**[https://glowluxe-app-1.onrender.com](https://glowluxe-app-1.onrender.com)**

---

## 1. Introduction

GlowLuxe is a fully functional e-commerce web application built for a Rwandan skincare and lotion business. The platform enables customers to browse a catalog of premium lotion products, manage a shopping cart, complete checkout, and receive an email order confirmation with estimated delivery time.

---

## 2. Problem Statement

Many small businesses in Rwanda still rely on physical stores and manual order-taking, limiting their reach. GlowLuxe solves this by providing an affordable, modern online store that allows customers to shop anytime, anywhere.

---

## 3. Project Objectives

- Build a responsive, professional e-commerce web application
- Implement full product management with categories and search
- Build a complete shopping cart with add, remove, and quantity updates
- Provide a checkout process with email order confirmation
- Store products, customers, and orders in a SQLite database
- Deploy online and maintain a CI/CD pipeline
- Containerize with Docker

---

## 4. System Features

| Feature | Description |
|---|---|
| 🛍️ Product Catalog | 12 lotions across 4 categories |
| 🔍 Search & Filter | Real-time search + category filter pills |
| 🛒 Shopping Cart | Add, remove, update quantities, auto totals |
| 📦 Checkout | Customer info collection with form validation |
| 📧 Email Confirmation | Styled HTML email sent to customer after order |
| ⏱️ Delivery Estimate | Shows order time + 2-hour delivery estimate |
| 📊 Admin Dashboard | Orders, revenue, top products (password protected) |
| 📱 PWA Support | Installable on mobile, offline caching |
| 🎨 Responsive Design | Mobile-friendly with consistent branding |

---

## 5. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js + Express | Server and routing |
| EJS | HTML templating |
| SQLite3 | Database |
| express-session | Cart session management |
| Nodemailer | Email confirmation |
| CSS3 | Custom responsive styling |
| Docker | Containerization |
| GitHub Actions | CI/CD pipeline |
| Render | Cloud deployment |

---

## 6. System Architecture

```
Client (Browser)
      │
      ▼
Express Server (server.js)
  ├── Routes: /, /product/:id, /cart, /checkout, /about, /admin
  ├── Nodemailer: sends order confirmation email
  ├── Views: EJS templates
      │
      ▼
SQLite Database (database.sqlite)
  ├── products
  ├── orders
  └── order_items
```

---

## 7. Database Design

**products** — stores product catalog
| Column | Type |
|---|---|
| id | INTEGER PK |
| name | TEXT |
| category | TEXT |
| price | INTEGER |
| description | TEXT |
| image | TEXT |

**orders** — stores customer orders
| Column | Type |
|---|---|
| id | INTEGER PK |
| customer_name | TEXT |
| customer_email | TEXT |
| phone | TEXT |
| address | TEXT |
| total | INTEGER |
| created_at | DATETIME |

**order_items** — stores items per order
| Column | Type |
|---|---|
| id | INTEGER PK |
| order_id | INTEGER FK |
| product_name | TEXT |
| quantity | INTEGER |
| price | INTEGER |

---

## 8. Screenshots

> Screenshots of the running application:

| Page | Description |
|---|---|
| Homepage | Product catalog with search and category filter |
| Product Page | Full product details with Add to Cart |
| Cart | Items, quantities, and total |
| Checkout | Customer information form |
| Confirmation | Order confirmed with delivery time estimate |
| About | Team, mission, values |
| Admin | Dashboard with orders and revenue stats |

---

## 9. GitHub Repository

**[https://github.com/confy4/Glowluxe-app](https://github.com/confy4/Glowluxe-app)**

---

## 10. Deployment

**[https://glowluxe-app-1.onrender.com](https://glowluxe-app-1.onrender.com)**

Deployed on **Render** — free tier, always accessible.

---

## 11. CI/CD Pipeline

GitHub Actions workflow at `.github/workflows/ci.yml` runs on every push to `main`:

```yaml
steps:
  - Checkout code
  - Setup Node.js 20
  - npm install
  - npm test
  - docker build
```

✅ Evidence available under the [Actions tab](https://github.com/confy4/Glowluxe-app/actions)

---

## 12. Docker

```bash
# Build
docker build -t glowluxe-app .

# Run
docker run -p 3000:3000 glowluxe-app

# Or with Docker Compose
docker-compose up
```

**Dockerfile** uses `node:20-alpine` for a lightweight production image.

---

## 13. Run Locally

```bash
# Install dependencies
npm install

# Start the app
npm start

# Open in browser
http://localhost:3000

# Run tests
npm test
```

---

## 14. Innovation Features (Bonus)

| Feature | Details |
|---|---|
| 🔍 Product Search | Real-time search combined with category filtering |
| 📊 Admin Dashboard | Revenue, orders, top products at `/admin?pass=glowluxe2025` |
| 📧 Email Confirmation | Styled HTML email with order details sent to customer |
| ⏱️ Delivery Estimate | Auto-calculated 2-hour delivery time shown on confirmation |
| 📱 PWA | App installable on mobile with offline support |

---

## 15. Challenges Encountered

- **SQLite on Alpine Linux** — native compilation required careful Docker setup
- **Session persistence** — solved using `express-session` for cart state
- **Image format mismatch** — some `.jpg` references pointed to `.webp` files, fixed by matching exact filenames
- **Email delivery** — configured Gmail SMTP with App Password for reliable sending

---

## 16. Future Enhancements

- MTN Mobile Money payment integration
- User authentication and order history
- Real-time SMS/WhatsApp notifications
- AI-powered product recommendations
- Multi-language support (Kinyarwanda, French, English)

---

## 17. Conclusion

GlowLuxe demonstrates a complete, production-ready e-commerce web application covering the full customer journey from product discovery to email-confirmed order. It meets all assignment requirements and includes multiple innovation features for bonus marks.

---

> © 2025 GlowLuxe Lotion Co. — Made with ❤️ in Rwanda
