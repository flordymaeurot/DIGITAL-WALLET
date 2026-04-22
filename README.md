# Digital Wallet System

A comprehensive full-stack web application demonstrating secure financial transactions with ACID principles.

## 📱 Overview

The Digital Wallet System is a web-based application that allows users to:
- Register and securely log in
- Manage their wallet balance
- Add money (cash-in)
- Send money to other users
- View complete transaction history

All transactions are backed by a relational PostgreSQL database with ACID compliance, ensuring data integrity and security.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm 8+

### Setup
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Create .env file with your database credentials
cp .env.example .env

# Start backend (port 3000)
npm run dev

# In a new terminal, start frontend (port 4200)
npm start
```

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📚 Documentation

- [DIGITAL_WALLET_README.md](./DIGITAL_WALLET_README.md) - Complete feature documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup and testing guide

## 🏗️ Architecture

**Frontend**: Angular 21 with TypeScript, RxJS, and modern styling
**Backend**: Node.js/Express with TypeScript
**Database**: PostgreSQL with ACID transactions

## ✨ Key Features

✅ User authentication with JWT tokens
✅ Real-time wallet balance updates
✅ Secure money transfers with ACID transactions
✅ Complete transaction history with pagination
✅ ACID compliance (Atomicity, Consistency, Isolation, Durability)
✅ Role-based security and validation
✅ Responsive modern UI

## 🔒 Security

- Password hashing with bcryptjs
- JWT token authentication
- HTTP request interceptors
- Database constraints and validation
- Transaction isolation and locking
- CORS protection

## 📊 Transaction Processing

The system demonstrates ACID principles:

- **Atomicity**: Transfers complete entirely or are rolled back
- **Consistency**: Balance constraints ensure validity
- **Isolation**: Concurrent transfers don't interfere (locking)
- **Durability**: Committed transactions persist permanently

## 📁 Project Structure

```
sams/
├── backend/              # Node.js/Express API
├── src/                  # Angular frontend
├── public/               # Static assets
├── DIGITAL_WALLET_README.md
├── SETUP_GUIDE.md
└── README.md            # This file
```

## 🎯 Use Cases

1. **Register & Login**: Create account and authenticate
2. **Cash-In**: Add funds to your wallet
3. **Send Money**: Transfer funds to another user
4. **View History**: Track all transactions with pagination

## 📋 API Endpoints

All endpoints (except register/login) require JWT authentication:

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/profile       - Get profile (protected)
GET    /api/wallet             - Get wallet (protected)
POST   /api/wallet/cash-in     - Add money (protected)
POST   /api/wallet/send-money  - Send money (protected)
GET    /api/transactions       - Get history (protected)
GET    /api/transactions/:id   - Get details (protected)
```

## 🛠️ Development

### Frontend Commands
```bash
npm start    # Start dev server (port 4200)
npm run build    # Build for production
npm test     # Run tests
```

### Backend Commands
```bash
npm run dev  # Start with ts-node
npm run build    # Compile TypeScript
npm start    # Run compiled code
npm test     # Run tests
```

## 📖 Testing

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for:
- Test account creation
- Workflow testing instructions
- API testing with cURL examples
- Troubleshooting guide

## 💡 Key Implementation Details

### Database Transactions
- Uses PostgreSQL BEGIN/COMMIT/ROLLBACK
- Row-level locking with FOR UPDATE clause
- Automatic rollback on errors

### Authentication Flow
1. User registers/logs in
2. Backend generates JWT token
3. Token stored in localStorage
4. HTTP interceptor adds token to all requests
5. Backend validates token on protected routes

### Balance Management
- Checked on every transfer
- Locked during transaction
- Updated atomically with receiver
- Transaction recorded immediately

## 🔐 Data Protection

- Passwords never stored in plain text
- Tokens expire after 24 hours
- Database constraints prevent invalid states
- All inputs validated server-side
- SQL injection prevention via parameterized queries

## 📈 Performance

- Connection pooling for database
- Database indexes on frequently queried columns
- Pagination for large datasets
- Lazy loading of wallet data
- Efficient JWT validation

## 🚀 Deployment

See DIGITAL_WALLET_README.md for production deployment considerations.

## 📝 License

MIT

## 👥 Support

For issues, refer to the troubleshooting section in SETUP_GUIDE.md.

---

**Built with Angular 21, Node.js, Express, TypeScript, and PostgreSQL**

Visit [SETUP_GUIDE.md](./SETUP_GUIDE.md) to get started!
