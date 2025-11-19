# Online Game Store — CRUD Web Application
*A 3-Tier Business Application for the course “Ειδικά Θέματα Τεχνολογίας Λογισμικού”*



## Overview
This project is a commercial-style CRUD web application for managing an online game store.

Users can:
- Browse digital games  
- Create accounts  
- Purchase titles  
- Manage their profiles  

Admins can manage the store catalog (create, edit, delete games).

The application is built using a 3-tier architecture:
- **Front-end:** Single Page Application (SPA)  
- **Business Logic Layer:** REST API with OOP and Dependency Injection  
- **Database Layer:** Relational DB with ORM  

The project follows Agile methodology with:
- User stories  
- Product backlog  
- 15-day sprints  



## Features (MVP)

### Users
- Register / Login  
- Browse available games  
- View game details  
- Add games to cart / purchase (simplified checkout)  
- View purchase history  

### Admin
- Add new games  
- Edit existing games  
- Delete games  

### Authentication & Authorization
- Username / Password login  
- JWT-based authentication  
- Role-based access (User, Admin)  ?



## Architecture

This application implements a strict **3-layer architecture**:

### 1. Front-End (SPA)
**Framework:** React  
**Responsibilities:**
- UI rendering  
- State management  
- Communication with backend through REST API  


### 2. Business Logic Layer (API)
- REST controllers  
- Services implementing core business rules  
- Repository pattern  
- **Dependency Injection (required)**  
- Authentication & Authorization using JWT  


### 3. Database Layer
**Database:** SQLite  
**ORM:** Django ORM  

Responsibilities:
- Data persistence  
- Migrations  
- Entity relationships  



## Tech Stack

- **Front-end:** React  
- **Backend:** .NET 8 Web API  
- **ORM:** Entity Framework Core  
- **Database:** SQLite  
- **Testing:** xUnit + Playwright  
- **Project Management:** Trello  
- **Version Control:** Git + GitHub  
