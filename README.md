# Institute Automation System

Institute Automation System is a full-stack web application designed to automate and streamline various institutional processes. The system consists of a backend server built with Node.js and Express, and a frontend client developed using React.js.

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Seeding the Database](#seeding-the-database)
- [Running Tests](#running-tests)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

This repository contains two main parts:

- `api/`: The backend server built with Node.js and Express.
- `client/`: The frontend client built with React.

## Prerequisites

Ensure you have the following installed:

- Node.js (version 16 or higher)
- npm (Node package manager)

## Installation

### Backend

1. Navigate to the backend directory:
    ```bash
    cd api
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

### Frontend

1. Navigate to the client directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

### Backend Server

To run the backend server, use:

```bash
cd api
npm run dev
```

### Frontend Client

To start the frontend development server, use:

```bash
cd client
npm start
```

## Environment Variables

Create `.env` files in both the `api` and `client` directories and add appropriate environment variables.

### Example: `api/.env`

```
RAZORPAY_KEY_ID= 
RAZORPAY_KEY_SECRET= 
PORT=8000 # Or any port you prefer for the backend
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
MONGODB_URI=
```

### Example: `client/.env`

```
REACT_APP_RAZORPAY_KEY_ID = 
GENERATE_SOURCEMAP=false
```

## Seeding the Database

To seed the database with initial data, run:

```bash
cd api
npm run seed
```

## Running Tests

To execute the backend test suite:

```bash
cd api
npm run test/<file-name>
```

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB 
- Mongoose 
- JWT Authentication
- Jest for testing

### Frontend

- React.js
- React Router
- Context API
- Axios

## Folder Structure

### Backend (`api/`)

```
controllers/       - Handles route logic
database/          - Database connection
helpers/           - Utility functions
middleware/        - Auth and error handlers
models/            - Database schemas/models
routes/            - API route definitions
scripts/           - Custom scripts (e.g., seeders)
tests/             - Test cases
utils/             - Common utility code
index.js           - Main entry point
```

### Frontend (`client/`)

```
public/            - Static files
src/
  assets/          - Images and other assets
  components/      - Reusable UI components
  context/         - Global state management
  pages/           - React page components
  utils/           - Utility functions
  App.jsx          - Main application component
  index.js         - React app entry point
```
## Documentation
[Institute Automation Technical and User Documentation](https://instituteautomation.netlify.app/)
## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your proposed changes. Ensure your code is well-documented and tested.
