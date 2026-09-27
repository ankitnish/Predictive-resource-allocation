# 🚨 Predictive Resource Allocation for High-Impact Area Response

**An AI-powered decision-support platform that helps emergency-response teams allocate limited resources — ambulances, fire trucks, rescue teams — to the areas that need them most, before and during high-impact incidents.**

> Built as a full-stack MERN application with a Python-based ML/optimization layer, designed as a **decision-support system**, not an autonomous authority. Every recommendation is explainable and requires human review.

---

## 📌 The Problem

Emergency-response agencies operate with a fixed, limited pool of resources but face incidents that are unpredictable in timing and location. Today, allocation decisions are largely:

- **Reactive** — resources dispatch only after an incident is already reported
- **Intuition-driven** — based on a coordinator's experience, not systematic data
- **Fragmented** — weather, population density, infrastructure, and incident history are never combined into a single operational view

The result: delayed response times, under-resourced high-risk areas, and decisions that are difficult to justify or audit after the fact.

## 💡 The Solution

This platform ingests historical incident data, resource availability, population/infrastructure data, and weather conditions to answer three questions coordinators currently can't answer reliably:

1. **Which areas are likely to experience a serious incident soon?** *(risk prediction)*
2. **How many resources will each area actually need?** *(demand forecasting)*
3. **Given limited resources, what's the optimal way to distribute them?** *(constraint-based optimization)*

Recommendations are always explained, always reviewable, and never auto-executed — a human coordinator makes the final call.

---

## ✅ Current Build Status

This project is being built incrementally, module by module, with each piece fully tested before moving to the next. Here's the honest, current state:

| Module | Status |
|---|---|
| Authentication (JWT, roles, RBAC) | ✅ Complete |
| Incident Management (CRUD) | ✅ Complete |
| Resource Management (CRUD) | ✅ Complete |
| Dashboard (live stats from real data) | ✅ Complete |
| Interactive Risk Map (Leaflet, geospatial) | ✅ Complete |
| Synthetic Dataset (12 areas, 550+ incidents, weather) | ✅ Complete |
| Frontend Incident/Resource Management UI | ✅ Complete |
| ML Risk Prediction (Random Forest / XGBoost) | 🚧 In Progress |
| Time-Series Demand Forecasting | 🚧 Planned |
| OR-Tools Resource Optimization | 🚧 Planned |
| Explainable Recommendations + Approval Workflow | 🚧 Planned |
| Baseline Comparison Experiment | 🚧 Planned |
| Real-Time Updates (Socket.IO) | 🚧 Stretch Goal |

*No feature listed as complete relies on hardcoded or fabricated output — everything marked ✅ is backed by real database queries and tested end-to-end via Postman and manual QA.*

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   React Frontend     │   Leaflet Maps · Recharts · Tailwind CSS
└──────────┬───────────┘
           │ REST (JWT-authenticated)
┌──────────▼───────────┐
│  Node.js + Express    │   Auth · Incident/Resource APIs · Role-based access
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│      MongoDB          │   Geospatial (2dsphere) · Areas, Incidents, Resources,
│      (Atlas)          │   Predictions, Recommendations, Weather Data
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│  Python + FastAPI     │   Risk Prediction · Demand Forecasting ·
│   (ML Service)        │   OR-Tools Optimization
└───────────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite) · React Router · Tailwind CSS v4 · Leaflet / React-Leaflet · Recharts · Axios

**Backend**
- Node.js · Express.js · MongoDB + Mongoose · JWT Authentication · bcrypt

**Machine Learning & Optimization** *(in progress)*
- Python · FastAPI · Pandas · NumPy · Scikit-learn · XGBoost · Google OR-Tools

**Database**
- MongoDB Atlas (cloud-hosted, geospatial indexing via `2dsphere`)

---

## ✨ Key Features

- 🔐 **Role-based access control** — Admin, Coordinator, and Analyst roles with distinct permissions
- 🗺️ **Interactive risk map** — color-coded geographic zones, click-through area details (population, incident history, resource availability)
- 📊 **Live operational dashboard** — active incidents, resource availability, average response time, computed directly from live data (no mock numbers)
- 🚑 **Full incident lifecycle management** — create, update status, track severity, response time, and resolution
- 🚒 **Resource tracking** — ambulances, fire trucks, rescue teams, medical units, shelters, with real-time status (available / deployed / maintenance)
- 🧪 **Realistic synthetic dataset** — 12 geographic zones, 550+ incidents spanning 2 years, weather observations, all clearly flagged as synthetic (never presented as real emergency data)

---

## 📁 Project Structure

```
predictive-resource-allocation/
├── frontend/               # React + Vite application
│   └── src/
│       ├── components/     # Shared UI (Layout, nav)
│       ├── pages/          # Login, Dashboard, RiskMap, Incidents, Resources
│       ├── services/       # Axios API clients
│       └── context/        # Auth context
│
├── backend/                # Node.js + Express API
│   └── src/
│       ├── controllers/    # Business logic
│       ├── routes/         # REST endpoints
│       ├── middleware/     # Auth + role-based authorization
│       ├── models/         # Mongoose schemas
│       └── scripts/        # Synthetic data generator
│
├── ml-service/              # Python + FastAPI (in progress)
│   └── app/
│       ├── models/          # Trained model artifacts
│       ├── routes/          # Prediction/forecasting/optimization endpoints
│       └── preprocessing/
│
└── docs/                    # Architecture & API documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- Python 3.10+ (for the ML service)
- A MongoDB Atlas account (free tier is sufficient)

### 1. Clone the repository
```bash
git clone https://github.com/ankitnish/predictive-resource-allocation.git
cd predictive-resource-allocation
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
```

```bash
npm run dev
```

### 3. Seed the database with synthetic data
```bash
node src/scripts/generateSyntheticData.js --fresh
```

### 4. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login, returns JWT | Public |
| GET | `/api/incidents` | List all incidents | Required |
| POST | `/api/incidents` | Create incident | Coordinator/Admin |
| PUT | `/api/incidents/:id` | Update incident | Coordinator/Admin |
| DELETE | `/api/incidents/:id` | Delete incident | Coordinator/Admin |
| GET | `/api/resources` | List all resources | Required |
| POST | `/api/resources` | Create resource | Coordinator/Admin |
| GET | `/api/areas` | List areas with computed risk stats | Required |
| GET | `/api/dashboard/summary` | Live dashboard statistics | Required |

Full API documentation: [`docs/api.md`](./docs/api.md)

---

## 🗺️ Roadmap

- [x] Authentication & RBAC
- [x] Incident & Resource CRUD
- [x] Dashboard & Risk Map
- [x] Synthetic dataset generation
- [ ] ML-based risk prediction (Random Forest / XGBoost, evaluated on Accuracy/Precision/Recall/F1/ROC-AUC)
- [ ] Time-series demand forecasting (MAE/RMSE/MAPE)
- [ ] OR-Tools resource optimization engine
- [ ] Explainable recommendation reasoning
- [ ] Human approval workflow for AI recommendations
- [ ] Baseline comparison experiment (equal vs. risk-based vs. optimized allocation)
- [ ] Real-time updates via Socket.IO

---

## ⚖️ Design Philosophy

This system is intentionally built as a **decision-support tool, not an autonomous authority**. Every AI-generated recommendation is:
- **Explainable** — accompanied by the reasoning behind it
- **Reviewable** — subject to human approval before any real-world action
- **Auditable** — logged with model version, input data, and the human decision made

---

## 👤 Author

**Ankit** — Full-Stack Developer

Built solo as a hands-on project to learn full-stack development, database design, and applied machine learning end-to-end — from architecture through deployment.

---

## 📄 License

This project is for educational/portfolio purposes. Synthetic data only — not connected to any real emergency response system.