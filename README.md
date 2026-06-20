# PropSpace

PropSpace is a full-stack property listing application for rent and sale. Users can browse public listings, filter by city and price, and authenticated users can create, edit, and delete their own properties while managing their profile and password.

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs for authentication

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- Chakra UI

## Project Structure

```
propspace/
├── server/          # Express API
└── client/          # React frontend
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
MONGO_URI=mongodb://localhost:27017/propspace
JWT_SECRET=your_secret_key_here
```

Start the API:

```bash
npm run dev
```

The server runs on `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` by default.

## Environment Variables

| Variable    | Location | Description                          |
|-------------|----------|--------------------------------------|
| `MONGO_URI` | `server/.env` | MongoDB connection string       |
| `JWT_SECRET`| `server/.env` | Secret key for signing JWT tokens |

## API Overview

| Method | Endpoint                    | Access    |
|--------|-----------------------------|-----------|
| POST   | `/api/auth/register`        | Public    |
| POST   | `/api/auth/login`           | Public    |
| GET    | `/api/properties`           | Public    |
| GET    | `/api/properties/mine`      | Protected |
| POST   | `/api/properties`           | Protected |
| PUT    | `/api/properties/:id`       | Protected |
| DELETE | `/api/properties/:id`       | Protected |
| GET    | `/api/users/me`             | Protected |
| PUT    | `/api/users/me`             | Protected |
| PUT    | `/api/users/me/password`    | Protected |
