# StayEase — Hotel Booking System

A full-stack hotel booking platform:

| Service | Stack | Port | Role |
|---|---|---|---|
| `hotel-backend` | Java 21 / Spring Boot | `8080` | Core REST API — auth, rooms, room types, bookings, payments |
| `hotel-realtime` | Node.js / Express / Socket.IO | `4000` | Live notifications (JS backend) |
| `hotel-frontend` | React 19 / Vite / Tailwind CSS v4 | `5173` | Guest & admin web app |

## What's included

- **Guest side**: browse & search rooms by date/type/guests, room details, booking flow, mock payment, "My Bookings" with cancellation, editable profile.
- **Admin side**: dashboard with live stats + a real-time activity feed, full CRUD on room types and rooms, and read views of every booking and payment.
- **Real-time**: the moment a booking, cancellation, or payment happens, connected admins (and the guest who triggered it) see a live toast — no page refresh.
- **Auth**: JWT-based login/registration, role-aware routing (`CUSTOMER` vs `ADMIN`) on both the API and the frontend.

## Fixes made to the existing backend

The Spring Security config had two bugs that blocked the app from working with any frontend, both fixed in `hotel-backend`:
1. `permitAll()` was pointed at `/api/customers/login` and `/api/customers/register`, but the real endpoints are `POST /api/auth/login` and `POST /api/customers` — so login and registration both required a token you couldn't get. Fixed to match the real routes.
2. There was no CORS configuration, so a browser-based frontend on a different port would be blocked outright. Added a `CorsConfigurationSource` bean.

Also added: a `/api/customers/me` endpoint (get/update your own profile), locked the admin-facing customer list/get/update/delete endpoints to `ADMIN` only, added an ownership check to booking cancellation, and opened room/room-type browsing to the public (so guests can look around before creating an account — bookings and payments still require login).

## Running it locally

You'll need Java 21+, Maven, Node.js 18+, and a MySQL (or your configured) database for the backend.

### 1. Backend (Spring Boot)

```bash
cd hotel-backend
# configure src/main/resources/application.properties with your DB credentials
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`.

### 2. Realtime service (Node/Express)

```bash
cd hotel-realtime
npm install
npm start
```
Runs on `http://localhost:4000`.

### 3. Frontend (React/Vite)

```bash
cd hotel-frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. Copy `.env.example` to `.env` if you need to point it at different backend URLs.

### First admin account

Registration through `/api/customers` always creates a `CUSTOMER`. To get an `ADMIN` account, register normally, then update that customer's `role` column to `ADMIN` directly in the database (there's no self-service admin signup, by design).

## Project structure

```
StayEase-Hotel-Booking-System/
├── hotel-backend/     Java Spring Boot REST API
├── hotel-realtime/    Node/Express + Socket.IO notifications
└── hotel-frontend/    React + Vite + Tailwind CSS frontend
```
