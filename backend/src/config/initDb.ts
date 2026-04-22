import pool from './database';

export async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create wallets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE,
        balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance >= 0),
        currency VARCHAR(3) DEFAULT 'USD',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID,
        receiver_id UUID,
        wallet_id UUID NOT NULL,
        amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
        transaction_type VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
      );
    `);

    // Create indexes for better query performance
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_sender_id ON transactions(sender_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_receiver_id ON transactions(receiver_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export default pool;
