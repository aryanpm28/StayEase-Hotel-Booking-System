# StayEase – Full Stack Hotel Booking System

StayEase is a **full-stack hotel booking application** built using **Spring Boot**, **React**, **Node.js**, **MySQL**, and **JWT Authentication**. It features a modern responsive frontend, a secure REST API backend, and real-time notifications, providing a complete hotel booking experience for both customers and administrators.

---

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- MySQL
- Maven

### Realtime
- Node.js
- Express
- Socket.IO

---

## Features

### Customer
- User Registration & Login
- JWT Authentication
- Browse Available Rooms
- Search Rooms by Type, Dates & Guests
- Room Booking
- Mock Payment System
- View & Cancel Bookings
- Update Profile
- Responsive User Interface

### Admin
- Admin Dashboard
- Manage Room Types
- Manage Rooms
- View All Bookings
- View All Payments
- Real-time Activity Notifications

---

## Security

- JWT Authentication
- Spring Security
- Role-Based Authorization (ADMIN / CUSTOMER)
- Ownership-Based Access Control
- BCrypt Password Encryption

---

## Project Structure

```text
StayEase-Hotel-Booking-System/
│
├── hotel-backend/      # Spring Boot REST API
├── hotel-frontend/     # React + Vite Frontend
├── hotel-realtime/     # Node.js + Socket.IO Server
└── README.md
```

---

## Running the Project

### 1. Backend

```bash
cd hotel-backend
./mvnw spring-boot:run
```

Runs on:

```
http://localhost:8080
```

---

### 2. Realtime Server

```bash
cd hotel-realtime
npm install
npm start
```

Runs on:

```
http://localhost:4000
```

---

### 3. Frontend

```bash
cd hotel-frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## Database

Configure your MySQL database in:

```text
hotel-backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stayease
spring.datasource.username=root
spring.datasource.password=your_password
```

---

## Future Improvements

- Email Notifications
- Payment Gateway Integration (Stripe/Razorpay)
- Hotel Reviews & Ratings
- Image Upload
- Booking Reports
- Docker Deployment

---

## Author

**Aryan Patil**

**Full Stack Java Developer**

**Tech Stack:** Java • Spring Boot • React • Node.js • MySQL
