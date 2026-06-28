# Food Ordering System

This is a Food Ordering System developed using React.js, Node.js, Express.js, and MongoDB. This project was created as an internship assignment.

## Features

### Customer

- Register
- Login
- View Food Items
- Place Order

### Admin

- Login
- Add Food
- Update Food
- Delete Food
- View Customer Orders
- Update Order Status

## Technologies Used

Frontend

- React.js
- CSS
- Axios

Backend

- Node.js
- Express.js

Database

- MongoDB Atlas

Authentication

- JWT
- bcryptjs

## Project Structure

```
Food-Ordering-System

client/

server/
├── config
├── controllers
├── middleware
├── models
├── routes
├── app.js
└── package.json
```

## Installation

Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

Go to the server folder

```bash
cd server
```

Install packages

```bash
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
```

Run the server

```bash
npm run dev
```

## API Endpoints

Authentication

- POST /api/auth/register
- POST /api/auth/login

Foods

- GET /api/foods
- POST /api/foods/add
- PUT /api/foods/:id
- DELETE /api/foods/:id

Orders

- POST /api/orders/place
- GET /api/orders
- PUT /api/orders/:id

## Author

Name: Muhammad Mubashir Nutkani

Email: mobisaylani@gmail.com

Phone: 0310-8770831

GitHub: https://github.com/mmubashirjs/Food-Ordering-System