# Online Game Store — CRUD Web Application

A 3-Tier Business Application for the course "Special Topics in Software Engeneering".

## Overview

A full-stack commercial-style web application for managing an online game store. Users can browse games, create accounts, add items to their cart, and purchase titles. Admins can manage the store catalog and see all and specified user order.

Built using a 3-tier architecture with a React SPA frontend, a Django REST API backend, and a SQLite database.

---

## Features

### Users
- Register / Login / Logout
- Browse available games and view game details
- Add games to cart, update quantities, remove items, clear cart
- Checkout and place orders
- View personal order history
- View and update profile

### Admin
- Add / Edit / Delete games
- Add / Edit / Delete categories
- View all orders across all users
- View and delete user accounts

---

## Architecture

### 1. Front-End (SPA)
- **Framework:** React
- Communicates with the backend exclusively through the REST API

### 2. Business Logic Layer (REST API)
- **Framework:** Django + Django REST Framework
- Follows a strict 3-layer structure: Controllers (Views), Services, Repositories
- Dependency Injection pattern
- JWT-based authentication and role-based authorization (User / Admin)

### 3. Database Layer
- **Database:** SQLite
- **ORM:** Django ORM
- Handles data persistence, migrations, and entity relationships

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Python / Django |
| API | Django REST Framework |
| Auth | JWT (SimpleJWT) |
| Database | SQLite |
| ORM | Django ORM |
| Testing | Pytest + pytest-django |
| Version Control | Git + GitHub |
| Project Management | Trello |

---

## Project Structure

```
store_api/
├── accounts/         # User auth, registration, profile, JWT
├── products/         # Games catalog and categories
├── cart/             # Cart management and checkout
├── orders/           # Order history
├── store_api/        # Django project settings and root URLs
├── tests/            # Integration tests
│   ├── test_accounts.py
│   ├── test_products.py
│   ├── test_cart.py
│   └── test_orders.py
├── conftest.py       # Pytest fixtures
└── pytest.ini        # Pytest configuration
```

---

## API Endpoints

### Accounts — `/api/`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/register/` | Register new user | No |
| POST | `/api/login/` | Login and receive JWT tokens | No |
| POST | `/api/logout/` | Logout | Yes |
| GET | `/api/profile/` | Get current user profile | Yes |
| POST | `/api/update/` | Update user details | Yes |
| GET | `/api/users/` | List all users | Yes |
| DELETE | `/api/users/<id>/` | Delete a user | Admin |

### Products — `/api/`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products/` | List all products | Yes |
| GET | `/api/products/details/` | Get product details | Yes |
| POST | `/api/products/add/` | Add a product | Yes |
| POST | `/api/products/update/` | Update a product | Yes |
| POST | `/api/products/delete/` | Delete a product | Yes |
| GET | `/api/categories/` | List all categories | Yes |
| POST | `/api/categories/add/` | Add a category | Yes |
| POST | `/api/categories/update/` | Update a category | Yes |
| POST | `/api/categories/delete/` | Delete a category | Yes |

### Cart — `/api/`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/cart/` | Get current user's cart | Yes |
| POST | `/api/cart/add/` | Add item to cart | Yes |
| PATCH | `/api/cart/update/<id>/` | Update item quantity | Yes |
| DELETE | `/api/cart/remove/<id>/` | Remove item from cart | Yes |
| DELETE | `/api/cart/remove/<id>/decrement/` | Decrease item quantity by 1 | Yes |
| DELETE | `/api/cart/clear/` | Clear entire cart | Yes |
| POST | `/api/cart/checkout/` | Checkout and create order | Yes |

### Orders — `/api/`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/orders/` | Get current user's orders | Yes |
| POST | `/api/orders/create/` | Create an order | Yes |
| GET | `/api/orders/all/` | Get all orders (all users) | Admin |
| GET | `/api/orders/user/<id>/` | Get orders for a specific user | Admin |

---

## How to Run

### Prerequisites
- Python 3.10+
- Node.js (for the React frontend)

### Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## How to Run Tests

```bash
# From the store_api/ directory (where manage.py is)
cd store_api

# Install test dependencies
pip install pytest pytest-django

# Run all tests
pytest

# Run with detailed output
pytest -v

# Run a specific test file
pytest tests/test_cart.py

# Stop at first failure
pytest -x
```
