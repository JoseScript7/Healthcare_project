# AI-Driven Distributed Smart Procurement & Expiry Management System

## Overview

The AI-driven Distributed Smart Procurement & Expiry Management System optimizes inventory management in healthcare supply chains. It reduces medical waste, ensures efficient resource utilization, and automates stock redistribution based on demand, expiry tracking, and restocking needs. The web application serves both large hospitals and small clinics/health centers, with customized CRUD operations for each user type.

## Core Features

### 1. User Authentication & Access Control
- Secure login/signup for admins and healthcare staff
- Role-based permissions (Admin, Hospital Staff, Supply Chain Manager)
- Two-factor authentication support

### 2. Smart Dashboard
- Real-time inventory overview (medicines, surgical equipment, supplies)
- Medical classification-based categorization
- Live stock levels and critical status monitoring

### 3. Inventory Management
| Operation | Description |
|-----------|-------------|
| Create | Add items manually or via bulk upload |
| Read | Search and filter by category, expiry, demand |
| Update | Modify stock details (quantity, expiry, etc.) |
| Delete | Remove expired/obsolete entries |

### 4. AI-Powered Expiry Management
- Automated tracking with urgency labeling:
  - **Critical** - Immediate redistribution needed
  - **Moderate** - Usage within timeframe required
  - **Safe** - Sufficient shelf life
- Proactive expiry alerts

### 5. Smart Stock Distribution
- AI-driven demand assessment across facilities
- Automated near-expiry stock redistribution
- Zero-touch inventory movement

### 6. Intelligent Restocking
- Predictive restocking based on usage patterns
- Automated supplier purchase orders
- Dynamic stock reshelf optimization

### 7. Analytics & Reporting
- Daily inventory analytics
- Interactive visualization dashboard
- Export capabilities (CSV, PDF)

### 8. System Flexibility
- Administrative override options
- Facility-specific CRUD customization
- Configurable AI parameters

## Technical Architecture

### Frontend
```jsx
React.js
├── Responsive UI
├── Styled Components
└── Data Visualization (Charts.js, D3.js)
```

### Backend
```javascript
Node.js + PostgreSQL
├── RESTful API (Express.js)
├── PostgreSQL Database
└── AI Processing Module
└── Python Integration
    ├── Advanced ML Processing
    ├── NumPy/Pandas Data Analysis
    └── TensorFlow/PyTorch Models




```

### Cloud Infrastructure
```
AWS
├── S3 (Storage)
├── Lambda (AI Tasks)
└── RDS (Database)
```

## System Workflow

1. **Authentication** → User login and dashboard access
2. **Classification** → AI-based stock categorization
3. **Monitoring** → Continuous expiry tracking
4. **Distribution** → Automated stock transfer
5. **Procurement** → Smart restocking
6. **Analytics** → Automated reporting
7. **Management** → Manual overrides

## Business Impact

- 📉 Reduced medical waste
- 📈 Optimized resource allocation
- 🌱 Enhanced sustainability
- 💰 Improved cost efficiency

## Database Schema

### Tables

```sql
-- Users and Authentication
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    facility_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE facilities (
    facility_id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Management
CREATE TABLE inventory_items (
    item_id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock (
    stock_id UUID PRIMARY KEY,
    item_id UUID REFERENCES inventory_items(item_id),
    facility_id UUID REFERENCES facilities(facility_id),
    quantity INTEGER NOT NULL,
    batch_number VARCHAR(100),
    expiry_date DATE,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY,
    from_facility_id UUID REFERENCES facilities(facility_id),
    to_facility_id UUID REFERENCES facilities(facility_id),
    item_id UUID REFERENCES inventory_items(item_id),
    quantity INTEGER NOT NULL,
    transaction_type VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI and Analytics
CREATE TABLE demand_forecasts (
    forecast_id UUID PRIMARY KEY,
    item_id UUID REFERENCES inventory_items(item_id),
    facility_id UUID REFERENCES facilities(facility_id),
    predicted_demand FLOAT,
    confidence_score FLOAT,
    forecast_period VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
    alert_id UUID PRIMARY KEY,
    facility_id UUID REFERENCES facilities(facility_id),
    item_id UUID REFERENCES inventory_items(item_id),
    alert_type VARCHAR(50),
    priority VARCHAR(50),
    message TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
smart-procurement/
├── client/                      # Frontend React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── styles/            # Global styles
│   │   └── utils/             # Helper functions
│   └── package.json
│
├── server/                     # Backend Node.js application
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helper functions
│   └── package.json
│
├── ai-module/                  # Python AI/ML services
│   ├── models/                # ML models
│   ├── processors/            # Data processors
│   ├── training/              # Model training scripts
│   └── requirements.txt
│
├── docs/                      # Documentation
│   ├── api/
│   ├── deployment/
│   └── development/
│
├── tests/                     # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docker/                    # Docker configuration
│   ├── client/
│   ├── server/
│   └── ai-module/
│
└── docker-compose.yml
```

---

*For technical documentation and API references, please refer to the [Technical Docs](./technical-docs.md).*

# Implementation Plan

## Phase 1: Foundation Setup (2-3 weeks)

### 1. Project Initialization
1. Set up project repositories and structure
2. Initialize base applications:
   - Frontend (React)
   - Backend (Node.js/Express)
   - AI Module (Python)
3. Configure Docker environments
4. Set up CI/CD pipeline

### 2. Database Implementation (1 week)
1. Set up PostgreSQL database
2. Implement base schema (users, facilities, inventory_items)
3. Create database migrations
4. Set up database backup system

### 3. Authentication System (1 week)
1. Implement user registration/login
2. Set up JWT authentication
3. Implement role-based access control
4. Add 2FA support

## Phase 2: Core Features (4-5 weeks)

### 4. Basic Inventory Management (2 weeks)
1. Create CRUD operations for inventory items
2. Implement stock management
3. Add batch and expiry tracking
4. Create basic search and filter functionality

### 5. Smart Dashboard (2 weeks)
1. Build real-time inventory overview
2. Implement stock level monitoring
3. Create medical classification system
4. Add data visualization components

### 6. Transaction System (1 week)
1. Implement stock transfer functionality
2. Create transaction logging
3. Add transaction status tracking
4. Implement facility-to-facility transfer

## Phase 3: AI Integration (4-5 weeks)

### 7. Expiry Management System (2 weeks)
1. Implement expiry tracking algorithm
2. Create urgency labeling system
3. Set up automated alerts
4. Build expiry dashboard

### 8. Demand Forecasting (2 weeks)
1. Implement basic ML models
2. Create demand assessment system
3. Set up automated data collection
4. Build prediction visualization

### 9. Smart Distribution (1 week)
1. Implement redistribution algorithm
2. Create automated transfer suggestions
3. Add manual override options
4. Set up notification system

## Phase 4: Analytics & Optimization (3-4 weeks)

### 10. Reporting System (2 weeks)
1. Create analytics dashboard
2. Implement export functionality
3. Add custom report generation
4. Build visualization tools

### 11. System Optimization (2 weeks)
1. Performance optimization
2. Security hardening
3. Error handling improvements
4. System monitoring setup

## Phase 5: Testing & Deployment (2-3 weeks)

### 12. Testing
1. Unit testing
2. Integration testing
3. End-to-end testing
4. Performance testing

### 13. Deployment
1. Production environment setup
2. Data migration
3. User training documentation
4. System monitoring setup

## Getting Started

To begin development:

1. Clone the repository
2. Install dependencies for each module:
   ```bash
   # Frontend
   cd client && npm install

   # Backend
   cd server && npm install

   # AI Module
   cd ai-module && pip install -r requirements.txt
   ```
3. Set up environment variables
4. Initialize the database
5. Start development servers

## First Task: Project Initialization

Let's begin with setting up the base project structure. Would you like to start with:
1. Frontend setup
2. Backend setup
3. Database initialization
4. AI module setup

Choose one area to focus on first, and we'll implement it step by step.
