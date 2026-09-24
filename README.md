# 🎫 Eventora --- Full Stack Event Management System

> A full-stack event management platform developed during my Full Stack
> Development Internship at GRASS Solutions Pvt. Ltd.

## 🌐 Live Demo

**[Open Eventora Live
Demo](https://eventmanagement-fullstack-1.onrender.com)**

> The Render free instance may take some time to wake up after
> inactivity.

## 📌 About the Project

Eventora is a full-stack Event Management System that provides a
centralized platform for discovering events, registering users,
verifying accounts through email OTP, booking events, managing seats,
and handling event administration.

The project demonstrates the complete flow of a modern web application
from a React frontend and REST APIs to MongoDB, authentication, email
services and cloud deployment.

## ✨ Key Features

### 👤 User Features

-   User registration and login
-   Email OTP verification
-   JWT-based authentication
-   Browse and view events
-   Event details with date, location, category, ticket price and seat
    availability
-   Booking OTP verification
-   Event booking and seat reservation
-   View personal bookings
-   Cancel bookings
-   Responsive UI

### 🛠️ Admin Features

-   Admin authentication
-   Admin dashboard
-   Create and manage events
-   View event information
-   View booking information
-   Manage booking-related data

### 🔐 Security & Authentication

-   JWT authentication
-   Password hashing with bcrypt
-   Protected routes
-   Role-based access
-   Email OTP verification
-   Environment variables for secrets
-   Bearer-token authorization

### 📧 Email

-   Registration/account verification OTP
-   Booking OTP
-   Booking confirmation email

### 💳 Payments

-   Razorpay configured in the backend for payment integration.
-   Payment credentials are stored through environment variables.

## 🔄 Application Flow

``` text
User
  ↓
Browse Events
  ↓
View Event Details
  ↓
Register / Login
  ↓
Email OTP Verification
  ↓
Select Event
  ↓
Request Booking OTP
  ↓
Verify Booking OTP
  ↓
Create Booking
  ↓
Reserve Seat
  ↓
Payment / Confirmation
  ↓
Confirmed Booking
```

## 🏗️ System Architecture

``` text
┌───────────────────────────────┐
│       React + Vite Client     │
│ Home | Login | Events | Admin │
└───────────────┬───────────────┘
                │ Axios / REST API
                ▼
┌───────────────────────────────┐
│      Node.js + Express        │
│ Auth | Events | Bookings      │
│ Controllers | Middleware      │
└───────┬───────────┬───────────┘
        │           │
        ▼           ▼
┌────────────┐  ┌──────────────┐
│ MongoDB    │  │ Email Service│
│ Atlas      │  │ Nodemailer   │
└────────────┘  └──────────────┘
        │
        ▼
┌────────────────┐
│ Razorpay API   │
└────────────────┘
```

## 🧰 Tech Stack

  Technology      Purpose
  --------------- ----------------------------
  React.js        Frontend UI
  Vite            Frontend build/development
  React Router    Client-side routing
  Axios           API communication
  Tailwind CSS    Responsive styling
  React Icons     UI icons
  Context API     Authentication state
  Node.js         Backend runtime
  Express.js      REST API
  MongoDB Atlas   Cloud database
  Mongoose        MongoDB ODM
  JWT             Authentication
  bcrypt          Password hashing
  Nodemailer      Email/OTP
  Razorpay        Payment integration
  Postman         API testing
  Git & GitHub    Version control
  Render          Deployment

## 📂 Project Structure

``` text
EVENTMANG/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── .gitignore
├── Eventora_Postman_Collection.json
├── package.json
└── README.md
```

## 🗄️ Database Models

### User

``` text
name
email
password
role
verification status
```

### Event

``` text
title
description
date
location
category
totalSeats
availableSeats
image
ticketPrice
createdBy
```

### Booking

``` text
userId
eventId
status
paymentStatus
amount
timestamps
```

### OTP

``` text
email
otp
action
```

## 🔐 Authentication Flow

``` text
Register
   ↓
Generate OTP
   ↓
Send OTP by Email
   ↓
Verify OTP
   ↓
Account Verified
   ↓
Login
   ↓
JWT Token
   ↓
Protected API Requests
```

Protected requests use:

``` text
Authorization: Bearer <JWT_TOKEN>
```

## 🎟️ Booking Flow

``` text
Select Event
    ↓
Check Login
    ↓
Send Booking OTP
    ↓
Enter OTP
    ↓
Verify OTP
    ↓
Check Event
    ↓
Check Available Seats
    ↓
Check Existing Booking
    ↓
Create Booking
    ↓
Reserve Seat
    ↓
Payment / Confirmation
```

The backend also releases the reserved seat when a booking is cancelled.

## 🔌 API Overview

### Authentication

``` text
POST /api/auth/register
POST /api/auth/verify-otp
POST /api/auth/login
```

### Events

``` text
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

### Bookings

``` text
POST /api/bookings/send-otp
POST /api/bookings
GET  /api/bookings
PUT  /api/bookings/:id/confirm
PUT  /api/bookings/:id/cancel
```

> Endpoint availability depends on the current backend route
> configuration.

## 🧪 API Testing

The backend APIs were tested using Postman.

Example booking OTP request:

``` text
POST /api/bookings/send-otp
Authorization: Bearer <token>
```

Example booking body:

``` json
{
  "eventId": "<event-id>",
  "otp": "<email-otp>"
}
```

A Postman collection is included in the repository.

## ⚙️ Environment Variables

Create `server/.env`:

``` env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Never commit the real `.env` file.** Keep MongoDB credentials, JWT
secrets, email credentials and Razorpay secrets private.

## 🚀 Run Locally

### Clone

``` bash
git clone https://github.com/parijainpari76-dotcom/EventManagement-FullStack.git
cd EventManagement-FullStack
```

### Backend

``` bash
cd server
npm install
npm run dev
```

Backend:

``` text
http://localhost:5001
```

### Frontend

Open another terminal:

``` bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## ☁️ Deployment

The application is deployed using Render.

``` text
GitHub
   ├──► Render Static Site
   │        ↓
   │   React Frontend
   │        ↓
   │    REST API
   │        ↓
   └──► Render Web Service
             ├── MongoDB Atlas
             ├── Email Service
             └── Razorpay
```

## 📱 Responsive Design

The interface is designed for: - Desktop - Laptop - Tablet - Mobile

Responsive styling is implemented using Tailwind CSS.

## 🎓 Internship

This project was developed as part of my **Full Stack Development
Internship at GRASS Solutions Pvt. Ltd.**

### Internship Work

-   Frontend development
-   Backend REST APIs
-   MongoDB integration
-   Authentication
-   OTP verification
-   Event and booking management
-   Postman API testing
-   Git/GitHub
-   Cloud deployment

## 📚 Learning Outcomes

Through Eventora, I gained practical experience with: - React component
architecture - Context API - REST APIs - Express middleware -
MongoDB/Mongoose - JWT - bcrypt - Nodemailer - OTP workflows - Booking
and seat management - Razorpay integration - Postman - Environment
variables - Git/GitHub - Render deployment

## 🔮 Future Improvements

-   Complete online payment flow
-   Payment webhook verification
-   Digital/QR tickets
-   QR-based ticket verification
-   Event search and advanced filters
-   Event reminders
-   Organizer-specific dashboards
-   Analytics and booking statistics
-   Enhanced admin permissions
-   Automated CI/CD
-   Improved notifications

## 📸 Screenshots

Recommended screenshots for the repository:

``` text
Home Page
Events Page
Event Details
Login / Register
OTP Verification
User Dashboard
Admin Dashboard
Create Event
Booking Flow
```

Example:

``` markdown
![Home Page](./screenshots/home.png)
```

## 👩‍💻 Author

### Pari Jain

**B.Tech Computer Science --- AI Specialization**

Full Stack Development \| MERN \| DSA \| AI

-   GitHub:
    [parijainpari76-dotcom](https://github.com/parijainpari76-dotcom)
-   Live Project:
    [Eventora](https://eventmanagement-fullstack-1.onrender.com)

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐
**Star**.

## 📄 License

This project was developed for educational, internship and portfolio
purposes.
