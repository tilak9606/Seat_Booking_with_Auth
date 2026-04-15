# Seat Booking with Auth

A secure movie seat booking platform with JWT authentication, email verification, and protected booking endpoints.

**Live Demo:** https://seat-booking-with-auth.onrender.com

## Tech Stack

Node.js, Express, PostgreSQL, Drizzle ORM, JWT, bcrypt, Nodemailer

## Quick Start

```bash
git clone https://github.com/tilak9606/Seat_Booking_with_Auth.git 
cd Seat_Booking_with_Auth
npm install
```

Create `.env`:

```env
PORT=8080
CLIENT_URL=http://localhost:8080
FRONTEND_URL=http://localhost:8080

#JWT configuration
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d

# SMTP configuration for nodemailer
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM_NAME=
SMTP_FROM_EMAIL=

#PostgreSQL configuration
DATABASE_URL=
```

Start:

```bash
npm run start
```

## API Endpoints

### Auth
- `POST /auth/register` - Register user
- `POST /auth/login` - Login (returns accessToken)
- `POST /auth/logout` - Logout (protected)
- `GET /auth/me` - Get profile (protected)
- `GET /auth/verifyemail/:token` - Verify email
- `POST /auth/forgot-password` - Request reset
- `PUT /auth/reset-password/:token` - Reset password

### Seats
- `GET /seats` - Get all seats
- `GET /seats/my-bookings` - Get my bookings (protected)
- `POST /seats/book` - Book seat (protected)
- `PUT /seats/cancel` - Cancel booking (protected)

## Auth Header

```
Authorization: Bearer <accessToken>
```
If you want registered user 

email:
```
chaicode@gmail.com
```
pass:
```
ChaiCode@123
```
