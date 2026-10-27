# Invoice Management System - Frontend

Frontend application for the Invoice Management System built with Vue 3 and TypeScript.

## Tech Stack

- Vue 3
- TypeScript
- Pinia
- Vue Router
- Axios
- Vite
- Tailwind CSS

## Features

### Authentication
- Login
- Protected Routes
- Token-based Authentication

### Customers
- Customers List
- Create Customer
- Customer Validation

### Sales Invoices
- Create Invoice
- Dynamic Invoice Items
- Real-time Totals Calculation
- Customer Selection
- PDF Download

### UI Features
- Responsive Layout
- Loading States
- Toast Notifications
- Data Tables
- Form Validation

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Project Structure

```text
src/
├── modules/
│   ├── Auth/
│   ├── Customers/
│   └── Invoices/
├── stores/
├── router/
├── services/
├── layouts/
└── shared/
```

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Current Modules

- Authentication
- Customers
- Sales Invoices

---

## Future Enhancements

- Invoice Editing
- Returns Management
- Expenses Management
- Dashboard Analytics
- Inventory Management


After running:

npm run dev

The application will be available at:

http://localhost:5173

Make sure the backend application is running and the API URL is configured correctly:

VITE_API_URL=http://localhost:8000/api/v1

Backend URL:

http://localhost:8000
"# kidora-platform-admin" 
