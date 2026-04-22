# Digital Wallet System

A comprehensive web-based application that allows users to register, log in, manage their balance, add money (cash-in), send money to other users, and view their transaction history. The system is built with Angular on the frontend and Node.js/Express on the backend, with PostgreSQL database supporting ACID transactions.

## Features

### 🔐 Authentication
- User registration with email validation
- Secure login with JWT tokens
- Token-based API authentication
- Session persistence

### 💰 Wallet Management
- View current balance
- Add money (cash-in) to wallet
- Send money to other users via email
- Real-time balance updates

### 📤 Money Transfer
- Send money to other registered users
- Transfer with optional description
- Secure database transactions ensuring ACID properties:
  - **Atomicity**: Transfers are all-or-nothing
  - **Consistency**: Balances never become invalid
  - **Isolation**: Concurrent transfers don't interfere
  - **Durability**: Committed transactions persist permanently

### 📋 Transaction History
- View all transactions with pagination
- Filter transactions by type (Cash-in, Send, Receive)
- Detailed transaction information
- Formatted dates and amounts

## Architecture

### Frontend (Angular)
```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts       - Authentication service
│   │   ├── wallet.service.ts     - Wallet operations
│   │   ├── transaction.service.ts - Transaction history
│   │   └── auth.interceptor.ts   - HTTP JWT interceptor
│   ├── pages/
│   │   ├── login/                - Login page
│   │   ├── register/             - Registration page
│   │   └── dashboard/            - Main dashboard
│   └── components/
│       ├── cash-in/              - Cash-in form
│       ├── send-money/           - Send money form
│       └── transaction-history/  - Transaction history
```

### Backend (Node.js/Express)
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           - DB connection pool
│   │   └── initDb.ts             - Schema initialization
│   ├── models/
│   │   ├── User.ts               - User model
│   │   ├── Wallet.ts             - Wallet model
│   │   └── Transaction.ts        - Transaction model
│   ├── controllers/
│   │   ├── authController.ts     - Auth endpoints
│   │   ├── walletController.ts   - Wallet endpoints
│   │   └── transactionController.ts - Transaction endpoints
│   ├── middleware/
│   │   └── auth.ts               - JWT authentication
│   ├── routes/
│   │   ├── auth.ts               - Auth routes
│   │   ├── wallet.ts             - Wallet routes
│   │   └── transactions.ts       - Transaction routes
│   └── server.ts                 - Main server file
```

### Database Schema

**Users Table**
- id (UUID): Primary key
- email (VARCHAR): Unique email
- username (VARCHAR): Unique username
- password_hash (VARCHAR): Hashed password
- first_name, last_name (VARCHAR): Optional names
- created_at, updated_at (TIMESTAMP)

**Wallets Table**
- id (UUID): Primary key
- user_id (UUID): Foreign key to users
- balance (DECIMAL): Current balance (non-negative)
- currency (VARCHAR): Currency code (default: USD)
- created_at, updated_at (TIMESTAMP)

**Transactions Table**
- id (UUID): Primary key
- wallet_id (UUID): Foreign key to wallets
- sender_id (UUID): Foreign key to users (nullable)
- receiver_id (UUID): Foreign key to users (nullable)
- amount (DECIMAL): Transaction amount
- transaction_type (VARCHAR): CASH_IN, SEND, RECEIVE
- description (VARCHAR): Optional description
- status (VARCHAR): Transaction status
- created_at (TIMESTAMP): Transaction timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Wallet
- `GET /api/wallet` - Get wallet info (protected)
- `POST /api/wallet/cash-in` - Add money (protected)
- `POST /api/wallet/send-money` - Send money (protected)

### Transactions
- `GET /api/transactions` - Get transaction history (protected)
- `GET /api/transactions/:id` - Get transaction details (protected)

## ACID Principles Implementation

### Atomicity
Uses PostgreSQL transactions with BEGIN/COMMIT/ROLLBACK:
```javascript
await client.query('BEGIN');
// Update sender balance
// Update receiver balance
// Record transactions
await client.query('COMMIT');
```

### Consistency
- Balance column has CHECK constraint (balance >= 0)
- Foreign key relationships maintain referential integrity
- Transaction amounts must be positive

### Isolation
- Uses `FOR UPDATE` locks on wallet rows during transfers
- Prevents dirty reads and race conditions
- Ensures serializable isolation level

### Durability
- Data persisted in PostgreSQL
- Committed transactions survive system failures
- Permanent audit trail in transactions table

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm 8+

### Frontend Setup
```bash
cd sams
npm install
npm start
```
Visit `http://localhost:4200`

### Backend Setup
```bash
cd sams/backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Start backend
npm run dev
```
Backend runs on `http://localhost:3000`

### Database Setup
1. Create PostgreSQL database:
```sql
CREATE DATABASE digital_wallet;
```

2. Update `.env` with database credentials
3. Run backend to auto-initialize schema

## Usage

1. **Register**: Create a new account with email, username, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your balance and available actions
4. **Cash-in**: Add money to your wallet
5. **Send Money**: Transfer funds to another user (enter their email)
6. **History**: View all your transactions with pagination

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ HTTP interceptors for token injection
- ✅ Database transaction locking
- ✅ Input validation
- ✅ CORS protection
- ✅ SQL injection prevention

## Error Handling

The system includes comprehensive error handling:
- Insufficient balance validation
- User existence checks
- Transaction rollback on errors
- User-friendly error messages
- Database constraint enforcement

## Performance Optimizations

- Database indexes on frequently queried columns
- Connection pooling for database
- Pagination for transaction history (20 items per page)
- Lazy loading of wallet balance
- Efficient JWT validation

## Future Enhancements

- Email notifications for transactions
- Transaction categories and filtering
- Monthly/weekly balance charts
- Recurring transfers
- Transaction search and filtering
- Multi-currency support
- Mobile app
- Two-factor authentication
- Transaction receipts
- Admin dashboard

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

**Built with Angular 21, Node.js, PostgreSQL, and TypeScript**
