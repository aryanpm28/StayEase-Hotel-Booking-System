# StayEase – Hotel Booking System

StayEase is a full-stack hotel booking application built using **Spring Boot**, **React**, **MySQL**, and **JWT Authentication**. It provides separate customer and admin features with a secure backend and a modern responsive frontend.

---

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- MySQL
- Maven

### Frontend
- React 19
- Vite
- Tailwind CSS

### Realtime
- Node.js
- Express
- Socket.IO

---

## Features

### Customer
- User Registration & Login
- JWT Authentication
- Browse Rooms
- Search by Room Type, Dates & Guests
- Book Rooms
- Mock Payment
- View & Cancel Own Bookings
- Update Profile

### Admin
- Dashboard
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
- Ownership Security
- Password Encryption (BCrypt)

---

## Project Structure

```
StayEase-Hotel-Booking-System/
│
├── hotel-backend/      Spring Boot REST API
├── hotel-frontend/     React + Vite
├── hotel-realtime/     Node.js + Socket.IO
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

```
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stayease
spring.datasource.username=root
spring.datasource.password=your_password
```

---

## Admin Account

New registrations are created with the **CUSTOMER** role.

To create an administrator account, update the user's role in the database:

```sql
UPDATE customers
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
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

B.Sc. Information Technology Student

Java Backend Developer | Spring Boot | React | MySQL
