# Theatre Booking App

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express)
![MariaDB](https://img.shields.io/badge/MariaDB-Database-003545?logo=mariadb)
![License](https://img.shields.io/badge/License-ISC-blue)

Mobile-first εφαρμογή κρατήσεων θεάτρου με React Native / Expo frontend και Node.js / Express API backend. Υποστηρίζει εγγραφή, σύνδεση, προβολή θεάτρων και παραστάσεων, επιλογή διαθέσιμων θέσεων, δημιουργία κρατήσεων και ακύρωση ενεργών κρατήσεων.

---

# Γρήγορη Εκκίνηση

```bash
git clone <repository-url>
cd theatre-booking-app
```

## Backend

```bash
cd backend
npm install
npm run dev
```

Το API ξεκινά προεπιλεγμένα στο:

```text
http://localhost:5000
```

## Frontend

Σε νέο terminal:

```bash
cd frontend
npm install
npm start
```

Έπειτα άνοιξε την εφαρμογή με Expo Go, Android emulator, iOS simulator ή web.

> Σημείωση: το frontend χρησιμοποιεί hardcoded API URL στο `frontend/src/api/api.js`.

```js
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});
```

---

# Πίνακας Περιεχομένων

* [Σκοπός](#σκοπός)
* [Tech Stack](#tech-stack)
* [Βασικά Features](#βασικά-features)
* [Αρχιτεκτονική](#αρχιτεκτονική)
* [Δομή Φακέλων](#δομή-φακέλων)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Scripts](#scripts)
* [API Usage](#api-usage)
* [Database](#database)
* [Deployment](#deployment)
* [Troubleshooting](#troubleshooting)
* [Contribution Guidelines](#contribution-guidelines)
* [License](#license)

---

# Σκοπός

Το project υλοποιεί ένα σύστημα κρατήσεων θεατρικών παραστάσεων. Οι χρήστες μπορούν να:

* δημιουργήσουν λογαριασμό
* συνδεθούν
* περιηγηθούν σε θέατρα
* δουν παραστάσεις και showtimes
* επιλέξουν θέσεις
* δημιουργήσουν ή ακυρώσουν κρατήσεις

---

# Tech Stack

## Frontend

* React Native `0.81.5`
* React `19.1.0`
* Expo `~54.0.33`
* Expo Router `~6.0.23`
* Axios
* Expo Secure Store
* TypeScript configuration

## Backend

* Node.js
* Express `5.x`
* JWT Authentication
* bcryptjs
* dotenv
* cors
* nodemon

## Database

* MariaDB
* SQL queries μέσω connection pool
* Transactions για ασφαλείς κρατήσεις

---

# Βασικά Features

* JWT Authentication
* User Registration / Login
* Theatre browsing
* Shows & showtimes
* Dynamic seat selection
* Multi-seat reservations
* Reservation cancellation
* Protected API routes
* Transaction-safe booking system

---

# Αρχιτεκτονική

```text
React Native / Expo App
        |
        | Axios HTTP requests
        v
Express REST API
        |
        | MariaDB connection pool
        v
MariaDB Database
```

Το backend ακολουθεί architecture:

* `routes/`
* `controllers/`
* `middleware/`
* `config/`

---

# Δομή Φακέλων

```text
theatre-booking-app/
├── backend/
├── frontend/
└── README.md
```

---

# Installation

## Προαπαιτούμενα

* Node.js
* npm
* MariaDB server
* Expo Go ή emulator

## Backend Setup

```bash
cd backend
npm install
```

Δημιούργησε `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=theatre_booking
JWT_SECRET=replace_with_a_secure_secret
```

Run development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# Environment Variables

| Variable    | Required | Description         |
| ----------- | -------- | ------------------- |
| PORT        | No       | Express server port |
| DB_HOST     | Yes      | MariaDB host        |
| DB_USER     | Yes      | Database user       |
| DB_PASSWORD | Yes      | Database password   |
| DB_NAME     | Yes      | Database name       |
| JWT_SECRET  | Yes      | JWT signing secret  |

---

# Scripts

## Backend

| Command     | Περιγραφή                  |
| ----------- | -------------------------- |
| npm run dev | Start backend with nodemon |
| npm start   | Production start           |

## Frontend

| Command         | Περιγραφή         |
| --------------- | ----------------- |
| npm start       | Start Expo server |
| npm run android | Run Android       |
| npm run ios     | Run iOS           |
| npm run web     | Run Web           |
| npm run lint    | Run lint          |

---

# API Usage

Base URL:

```text
http://localhost:5000/api
```

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

### Protected Endpoints

```http
Authorization: Bearer <token>
```

| Method | Endpoint              | Περιγραφή           |
| ------ | --------------------- | ------------------- |
| GET    | /api/theatres         | Λίστα θεάτρων       |
| GET    | /api/shows            | Λίστα παραστάσεων   |
| GET    | /api/showtimes        | Λίστα showtimes     |
| GET    | /api/seats            | Θέσεις              |
| POST   | /api/reservations     | Δημιουργία κράτησης |
| DELETE | /api/reservations/:id | Ακύρωση κράτησης    |

---

# Database

Βασικοί πίνακες:

```text
users
theatres
shows
showtimes
seats
reservations
reservation_seats
```

Το σύστημα χρησιμοποιεί transactions και row locking για αποφυγή διπλών κρατήσεων.

---

# Deployment

## Backend

```bash
cd backend
npm install --production
npm start
```

## Frontend

```bash
cd frontend
npx expo export --platform web
```

---

# Troubleshooting

## Frontend δεν συνδέεται

Έλεγξε:

```js
baseURL: "http://localhost:5000/api"
```

Σε πραγματική συσκευή χρησιμοποίησε LAN IP.

## 401 / 403 Errors

* Έλεγξε JWT token
* Έλεγξε Authorization header
* Έλεγξε JWT_SECRET

---

# Contribution Guidelines

1. Δημιούργησε feature branch
2. Κράτησε μικρές αλλαγές
3. Μην κάνεις commit `.env`
4. Τρέξε lint πριν από PR

```bash
cd frontend
npm run lint
```

---

# License

Το backend χρησιμοποιεί license `ISC`.

Προτείνεται η προσθήκη root `LICENSE` αρχείου για open-source διανομή.
