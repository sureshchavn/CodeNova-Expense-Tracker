# Finora – Expense Tracker

A full-stack Expense Tracker application built as part of the CodeNova Full Stack Development Internship – Task 2.

## Features

- Add, edit, and delete transactions
- Track income, expenses, and balance
- Search transactions
- Filter by income and expense
- View spending breakdown by category
- Interactive dashboard
- MongoDB Atlas database integration
- Responsive user interface

## Tech Stack

**Frontend**
- React.js
- Vite
- CSS
- Axios
- Recharts
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
CodeNova-Expense-Tracker/
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   ├── server.js
│   └── .env
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CodeNova-Expense-Tracker
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite, usually:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Get all transactions |
| POST | `/api/expenses` | Add a transaction |
| PUT | `/api/expenses/:id` | Update a transaction |
| DELETE | `/api/expenses/:id` | Delete a transaction |

## Security

- Environment variables are excluded from Git using `.gitignore`.
- Never commit your MongoDB connection string or `.env` file.

## Internship

**Program:** CodeNova Full Stack Development Internship  
**Task:** Task 2 – Expense Tracker


## Author

**Suresh Chavan**

- GitHub: [github.com/sureshchavn](https://github.com/sureshchavn)
- LinkedIn: [linkedin.com/in/sureshchavan](https://www.linkedin.com/in/suresh-chavan/)