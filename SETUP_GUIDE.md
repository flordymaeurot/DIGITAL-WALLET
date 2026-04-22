# Getting Started with Digital Wallet System

## Quick Start Guide

### Step 1: Install Dependencies

#### Frontend
```bash
cd c:\SAM\sams
npm install
```

#### Backend
```bash
cd c:\SAM\sams\backend
npm install
```

### Step 2: Setup Database

1. Install PostgreSQL (if not already installed)
2. Create the database:
```bash
psql -U postgres -c "CREATE DATABASE digital_wallet;"
```

3. Create `.env` file in `backend` folder with your credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=digital_wallet
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
NODE_ENV=development
```

### Step 3: Start the Backend Server

```bash
cd c:\SAM\sams\backend
npm run dev
```

The backend will:
- Connect to PostgreSQL
- Auto-create database schema
- Start on `http://localhost:3000`

### Step 4: Start the Frontend Development Server

In a new terminal:
```bash
cd c:\SAM\sams
npm start
```

Frontend will start on `http://localhost:4200`

### Step 5: Access the Application

Open browser and go to: `http://localhost:4200`

## Testing the Application

### Create Test Accounts

1. **Register first user:**
   - Email: `user1@example.com`
   - Username: `user1`
   - Password: `password123`

2. **Register second user:**
   - Email: `user2@example.com`
   - Username: `user2`
   - Password: `password123`

### Test Workflows

#### Test 1: Cash-In
1. Login with user1@example.com
2. Click "Cash In" button
3. Enter amount: 1000
4. Click "Add Money"
5. Check balance increased to 1000

#### Test 2: Send Money
1. Stay logged in as user1
2. Click "Send Money" button
3. Enter receiver: `user2@example.com`
4. Enter amount: 500
5. Click "Send Money"
6. Balance should now be 500

#### Test 3: Verify Receiver
1. Logout and login as user2@example.com
2. Check balance: should be 500
3. View transaction history
4. Should see "RECEIVE" transaction from user1

#### Test 4: Transaction History
1. Click on "View History"
2. See all transactions (Cash-in, Send, Receive)
3. Test pagination if you have many transactions

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Wallet (requires token)
```bash
curl -X GET http://localhost:3000/api/wallet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Cash-In
```bash
curl -X POST http://localhost:3000/api/wallet/cash-in \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "description": "Initial deposit"
  }'
```

### Send Money
```bash
curl -X POST http://localhost:3000/api/wallet/send-money \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverEmail": "recipient@example.com",
    "amount": 500,
    "description": "Payment for services"
  }'
```

### Get Transactions
```bash
curl -X GET "http://localhost:3000/api/transactions?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database `digital_wallet` exists

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Use `ng serve --port 4201`

### CORS Error
- Verify backend is running on port 3000
- Check CORS middleware in backend

### Module Not Found
- Run `npm install` in both frontend and backend
- Clear node_modules and reinstall if needed

### Authentication Failed
- Clear localStorage: Open DevTools, Application tab, clear local storage
- Try registering a new account

## Development Commands

### Frontend
```bash
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
```

### Backend
```bash
npm run dev        # Start with ts-node
npm run build      # Compile TypeScript
npm start          # Run compiled JavaScript
npm test           # Run tests
```

## Key Features to Demonstrate

1. **User Authentication**
   - Registration with validation
   - Secure login
   - JWT token management

2. **Wallet Management**
   - Real-time balance updates
   - Cash-in functionality

3. **Money Transfer (ACID Demonstration)**
   - Atomicity: Both balances updated or none
   - Consistency: No invalid balances
   - Isolation: Concurrent transfers safe
   - Durability: Transactions permanent

4. **Transaction History**
   - Complete audit trail
   - Pagination support
   - Transaction details

## Architecture Highlights

### Security
- Password hashing with bcryptjs
- JWT authentication
- HTTP interceptors
- Database constraints

### Database Transactions
- BEGIN/COMMIT/ROLLBACK pattern
- Row-level locking (FOR UPDATE)
- Foreign key constraints
- Check constraints for balance

### Error Handling
- Validation on frontend and backend
- Graceful error messages
- Transaction rollback on failure
- User-friendly feedback

### Performance
- Connection pooling
- Database indexing
- Pagination
- Efficient queries

## File Structure

```
sams/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Authentication
│   │   └── server.ts          # Entry point
│   └── package.json
├── src/
│   ├── app/
│   │   ├── services/          # Angular services
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   └── app.ts             # Root component
│   ├── styles.scss            # Global styles
│   ├── main.ts                # Bootstrap
│   └── index.html
└── package.json
```

## Next Steps

1. Explore the codebase
2. Review ACID implementation in `backend/src/controllers/walletController.ts`
3. Check database schema in `backend/src/config/initDb.ts`
4. Try concurrent transfers to test isolation
5. Review error handling and validation

Enjoy using the Digital Wallet System!
