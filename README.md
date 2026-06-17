# E-Commerce API (DevOps Project Setup)

Welcome to the Node.js E-Commerce API codebase. This is a production-grade RESTful API template structured for DevOps workflows, including containerization, automated testing, and CI/CD compatibility.

## Tech Stack
* **Runtime**: [Node.js](https://nodejs.org/) (v16+)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) (ODM: [Mongoose](https://mongoosejs.com/))
* **Testing**: [Jest](https://jestjs.io/)
* **Logging & Security**: [Morgan](https://github.com/expressjs/morgan), [Helmet](https://helmetjs.github.io/), [Cors](https://github.com/expressjs/cors)
* **Auth & Hashing**: [JSON Web Token (JWT)](https://jsonwebtoken.io/), [BcryptJS](https://github.com/dcodeIO/bcrypt.js)

---

## Project Directory Structure

```text
DevOps-Git/
├── .env.example         # Example environment configuration template
├── .env                 # Local environment configurations (ignored by git)
├── .gitignore           # Standard git ignoring configuration
├── package.json         # Node.js dependencies and run scripts
├── README.md            # Project documentation
└── src/
    ├── app.js           # Decoupled Express app setup (for testing)
    ├── server.js        # Server entry point (loads env, connects DB, starts server)
    ├── config/          # Configuration files (e.g. database connections)
    │   └── db.js
    ├── controllers/     # Route handler controllers (business logic)
    ├── middleware/      # Custom express middlewares (auth, errors, validation)
    │   └── errorHandler.js
    ├── models/          # Mongoose database models
    ├── routes/          # Express API route endpoints
    │   └── health.js
    └── utils/           # Utility functions and helper classes
```

---

## Installation & Setup

### Prerequisites
- Node.js (v16.x or higher installed)
- MongoDB running locally (or access to a MongoDB Atlas cluster URI)

### Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd DevOps-Git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file by copying the example configuration:
   ```bash
   cp .env.example .env
   ```
   *Note: Under Windows command prompt, use `copy .env.example .env`*

4. **Verify Database Configuration**
   Update the `MONGODB_URI` inside your `.env` file to match your MongoDB instance. Default is:
   ```ini
   MONGODB_URI=mongodb://localhost:27017/ecommerce-db
   ```

---

## Running the Application

### Development Mode (with Hot Reload / Nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## Testing

To run the automated test suite (configured with Jest):
```bash
npm run test
```

---

## API Health Monitoring

A basic health check endpoint is provided to monitor API status, database connectivity, and resource usage:

* **Endpoint**: `GET /health`
* **Response Output Example**:
  ```json
  {
    "status": "UP",
    "timestamp": "2026-06-17T05:23:00.000Z",
    "services": {
      "database": {
        "status": "UP",
        "state": "connected"
      }
    },
    "uptime": "12s",
    "environment": "development",
    "memoryUsage": {
      "rss": "32MB",
      "heapTotal": "10MB",
      "heapUsed": "6MB"
    }
  }
  ```
