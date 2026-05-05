# Theatre Booking Application

A full-stack mobile application for booking seats in theatrical performances.  
Developed as part of the course **Mobile & Distributed Systems (CN6035)**.

---

## Project Description

This application enables users to browse theatres and performances, select showtimes, choose available seats, and manage reservations through a mobile interface.

The system is composed of three main components:

- Mobile application (React Native - Expo)
- RESTful API backend (Node.js and Express)
- Relational database (MariaDB)

The primary objective is to provide a reliable and user-friendly reservation system with real-time seat availability and secure user authentication.

---

## Technology Stack

### Frontend
- React Native (Expo)

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)

### Database
- MariaDB / MySQL

---

## Key Features

- User registration and authentication
- Theatre and show browsing
- Showtime selection
- Real-time seat availability
- Reservation creation and cancellation
- User reservation management

---

## System Architecture

The application follows a client-server architecture:

- The mobile application acts as the client
- The backend exposes a REST API
- The database stores all persistent data

Communication between the client and server is performed via HTTP requests. The backend handles business logic, authentication, and database interactions.

---

## Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/johnmpournous/theatre-booking-app.git
cd theatre-booking-app
