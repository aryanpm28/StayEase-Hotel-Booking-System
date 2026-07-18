# hotel-realtime

The JavaScript (Node.js) piece of the StayEase backend. It doesn't own any data —
the Java Spring Boot API (`hotel-backend`) is still the source of truth — it purely
broadcasts **live notifications** over Socket.IO so the frontend can show things
like "New booking received" (for admins) or "Your booking is confirmed" (for the
guest) the instant they happen, without polling.

## How it fits together

```
React frontend
   │
   ├── REST calls  ────────────────► hotel-backend (Spring Boot, port 8080)
   │                                    – auth, rooms, bookings, payments
   │
   ├── after a successful booking/
   │   cancellation/payment call ──► hotel-realtime (Express, port 4000)
   │                                    POST /api/notify/booking-created
   │                                    POST /api/notify/booking-cancelled
   │                                    POST /api/notify/payment-completed
   │
   └── socket.io connection ───────► hotel-realtime
                                        receives "notification" events live
```

## Run it

```bash
cd hotel-realtime
npm install
npm start
```

Runs on `http://localhost:4000` by default (set `PORT` env var to change it).

## Endpoints

- `GET /health` – health check
- `POST /api/notify/booking-created`
- `POST /api/notify/booking-cancelled`
- `POST /api/notify/payment-completed`

## Socket events

- Client emits `identify` with `{ role: "ADMIN" }` or `{ customerId }` to join the
  right channel.
- Server emits `notification` with `{ type, message, ...data, timestamp }`.
