# GlowLuxe – E-Commerce Web Application
### Project Report
**Course:** EWA408510 – E-Commerce and Web Application
**Instructor:** Eric Maniraguha
**Academic Year:** 2025–2026
**Student:** CONFIANCE Iradukunda

---

## 1. Introduction

GlowLuxe is a fully functional e-commerce web application built for a Rwandan skincare and lotion business. The platform enables customers to browse a catalog of premium lotion products, view detailed product information, manage a shopping cart, complete a checkout process, and receive an order confirmation. The application is built with Node.js and Express, uses SQLite for data persistence, and is containerized with Docker. It is hosted on GitHub with a CI/CD pipeline powered by GitHub Actions.

---

## 2. Problem Statement

Many small and medium-sized businesses in Rwanda still rely on physical stores and manual order-taking, which limits their reach and operational efficiency. Customers have no way to browse products, compare prices, or place orders outside of business hours. There is a clear need for an affordable, easy-to-use online store that allows a local skincare business to sell products digitally, manage orders, and grow its customer base beyond Kigali.

---

## 3. Project Objectives

- Design and develop a responsive, professional e-commerce web application for a lotion-selling business
- Implement full product management including listing, categories, and product detail pages
- Build a complete shopping cart system with add, remove, and quantity update functionality
- Provide a checkout process with customer information collection and order confirmation
- Integrate a SQLite database to store products, customers, and orders
- Host the project on GitHub with meaningful commit history and documentation
- Deploy the application online and keep it accessible during evaluation
- Implement a CI/CD pipeline using GitHub Actions for automated build and testing
- Containerize the application using Docker and docker-compose

---

## 4. System Features

| Feature | Description |
|---|---|
| Product Catalog | 12 lotion products across 4 categories: Body Care, Luxury, Medicinal, Sun Care |
| Product Detail Page | Full description, price, image, and Add to Cart button per product |
| Shopping Cart | Add, remove, update quantity, and auto-calculated totals |
| Checkout Form | Collects customer name, email, phone, and delivery address |
| Order Confirmation | Displays order ID and total after successful checkout |
| About Page | Company story, mission, values, team section, and stats |
| Responsive Design | Mobile-friendly layout with consistent branding |
| Promo Bar | Animated scrolling promotional banner on all pages |
| Session Management | Cart persists across pages using server-side sessions |
| Database Seeding | Products are automatically inserted on first run |

---

## 5. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | Web framework for routing and middleware |
| EJS | Server-side HTML templating engine |
| SQLite3 | Lightweight relational database for products and orders |
| express-session | Session management for shopping cart persistence |
| CSS3 | Custom responsive styling with animations |
| Google Fonts | Playfair Display and Inter typefaces |
| Docker | Application containerization |
| Docker Compose | Multi-service container orchestration |
| GitHub Actions | CI/CD pipeline automation |
| GitHub | Version control and repository hosting |

---

## 6. System Architecture

GlowLuxe follows a classic three-layer MVC-style architecture:

```
Client (Browser)
      │
      ▼
Express Server (server.js)
  ├── Routes: /, /product/:id, /cart, /checkout, /about
  ├── Middleware: session, static files, URL parser
  ├── Views: EJS templates (index, product, cart, checkout, confirmation, about)
      │
      ▼
SQLite Database (database.sqlite)
  ├── products
  ├── orders
  └── order_items
```

- The client sends HTTP requests to the Express server
- Express processes the request, queries SQLite, and renders an EJS view
- Static assets (CSS, images) are served from the `/public` directory
- Sessions store the cart state server-side between requests

---

## 7. Database Design

The database contains three tables with the following structure:

**products**
| Column | Type | Description |
|---|---|---|
| id | INTEGER PK | Auto-incremented product ID |
| name | TEXT | Product name |
| category | TEXT | Product category |
| price | INTEGER | Price in Rwandan Francs |
| description | TEXT | Product description |
| image | TEXT | Image path |

**orders**
| Column | Type | Description |
|---|---|---|
| id | INTEGER PK | Auto-incremented order ID |
| customer_name | TEXT | Full name of customer |
| customer_email | TEXT | Customer email address |
| phone | TEXT | Customer phone number |
| address | TEXT | Delivery address |
| total | INTEGER | Total order amount in RWF |
| created_at | DATETIME | Timestamp of order placement |

**order_items**
| Column | Type | Description |
|---|---|---|
| id | INTEGER PK | Auto-incremented item ID |
| order_id | INTEGER FK | References orders.id |
| product_name | TEXT | Name of ordered product |
| quantity | INTEGER | Quantity ordered |
| price | INTEGER | Unit price at time of order |

---

## 8. Screenshots of the Application

> Screenshots should be taken from the running application and inserted here for the final submission. Recommended pages to capture:
> - Homepage (product catalog)
> - Product detail page
> - Shopping cart with items
> - Checkout form
> - Order confirmation page
> - About page

---

## 9. GitHub Repository Link

> https://github.com/[your-username]/glowluxe-app

*(Replace with your actual GitHub repository URL)*

---

## 10. Deployment Link

> https://[your-deployment-url]

*(Replace with your actual live deployment URL, e.g. Render, Railway, or Vercel)*

---

## 11. CI/CD Implementation

A GitHub Actions workflow is configured in `.github/workflows/ci.yml`. It triggers automatically on every push or pull request to the `main` branch and performs the following steps:

1. **Checkout** – Pulls the latest code from the repository
2. **Setup Node.js** – Installs Node.js version 20 using `actions/setup-node@v4`
3. **Install Dependencies** – Runs `npm install` to install all required packages
4. **Run Tests** – Executes `npm test` which runs the unit tests in `tests/cart.test.js` using Node's built-in test runner
5. **Docker Build** – Builds the Docker image (`glowluxe-app`) to verify the container builds successfully

```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test
      - run: docker build -t glowluxe-app .
```

> Evidence of successful workflow runs can be found under the **Actions** tab of the GitHub repository.

---

## 12. Docker Implementation

The application is fully containerized using Docker.

**Dockerfile** – Builds a lightweight production image using `node:20-alpine`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml** – Defines the application service and maps port 3000:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
```

**To build and run with Docker:**
```bash
docker build -t glowluxe-app .
docker run -p 3000:3000 glowluxe-app
```

**To run with Docker Compose:**
```bash
docker-compose up
```

The application will be accessible at `http://localhost:3000`.

---

## 13. Challenges Encountered

- **SQLite on Alpine Linux** – The `sqlite3` npm package requires native compilation. Using `node:20-alpine` in Docker required ensuring build tools were available during the image build.
- **Session persistence** – Shopping cart data needed to persist across page redirects. This was solved using `express-session` with server-side storage.
- **Database seeding race condition** – Two separate `db.get` calls for seeding ran asynchronously, which could cause duplicate product entries. This was managed carefully using SQLite's `db.serialize()` to queue operations.
- **Image format consistency** – Some image references in EJS templates used `.jpg` extensions while the actual files were `.webp`, causing broken images. These were corrected by matching the exact filenames in the `public/images/` directory.

---

## 14. Future Enhancements

- **Payment Gateway** – Integrate MTN Mobile Money or Airtel Money for real transactions
- **User Authentication** – Allow customers to register, log in, and view order history
- **Admin Dashboard** – Enable the business owner to manage products, view orders, and track revenue
- **Product Search and Filtering** – Add a search bar and category filter on the product listing page
- **Real-Time Notifications** – Notify the admin via email or SMS when a new order is placed
- **Progressive Web App (PWA)** – Make the app installable on mobile devices for offline browsing
- **AI Product Recommendations** – Suggest related products based on cart contents or browsing history

---

## 15. Conclusion

GlowLuxe successfully demonstrates a complete, production-ready e-commerce web application built to meet all requirements of the EWA408510 final project. The application covers the full customer journey from product discovery to order confirmation, backed by a relational database, secured with session management, automated through a CI/CD pipeline, and containerized with Docker. The project reflects both technical competence and practical understanding of modern web development and DevOps practices. It provides a solid foundation that can be extended with payment integration, authentication, and advanced features in future iterations.
