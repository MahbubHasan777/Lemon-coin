# Lemon Blockchain Explorer

A modern, dark-themed Blockchain Explorer clone (rebranded to **Lemon Network**).

## 🚀 Features

- **New Dashboard**: Real-time stats including **Gas Price**, **Last Finalized Block**, **Safe Block**, and a transaction history visualization.
- **Dual View**: Home page splits "Latest Transactions" and "Latest Blocks" into side-by-side panels.
- **Lemon Rebrand**: Fully rebranded UI with Lemon Network identity.
- **Trading Simulator**: `Trade` page to generate wallets and send test `LEMON` coins.
- **Auto-Mining**: Transactions confirm instantly for testing.

## 🛠 Tech Stack

- **Backend**: NestJS (Node.js) + MongoDB
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Custom CSS with Glassmorphism (Dark/Green theme)

## ▶️ How to Run

1. **Database**: Ensure MongoDB is running (`localhost:27017`).
2. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
   *Running on port 3001*
3. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   *Running on port 3000*

## 🔍 How to Use
- Visit `http://localhost:3000`.
- Search for blocks, transactions, or addresses using the new filterable search bar.
- Use the **Footer** to navigate (dummy links included for UI demo).

## 📂 Project Structure & Routes

### 🖥️ Frontend Routes (Next.js)

| Route | Description |
|-------|-------------|
| `/` | **Dashboard**: Shows real-time network stats, latest blocks, and latest transactions. |
| `/blocks` | **Block Explorer**: Paginated list of all blocks in the chain. |
| `/blocks/[hash]` | **Block Details**: View detailed info about a specific block (miner, transactions, etc.). |
| `/transactions` | **Transaction Explorer**: Paginated list of all transactions. |
| `/transactions/[hash]` | **Transaction Details**: View sender, receiver, amount, and status of a transaction. |
| `/address/[address]` | **Address/Wallet Explorer**: View balance and transaction history for a specific wallet address. |
| `/trade` | **Wallet & Tools**: Generate new wallets, check balances, and simulate transactions. |

### 🔗 Backend API Endpoints (NestJS)

#### Blocks
- `GET /api/blocks`: Get paginated blocks.
- `GET /api/blocks/latest`: Get the latest block.
- `GET /api/blocks/:hash`: Get block details by hash.

#### Transactions
- `GET /api/transactions`: Get paginated transactions.
- `GET /api/transactions/pending`: Get transactions waiting in the mempool.
- `GET /api/transactions/:hash`: Get transaction details.
- `POST /api/transactions`: Create/Broadcast a new transaction.
  - Body: `{ fromAddress, toAddress, amount, privateKey }`

#### Addresses (Wallets)
- `GET /api/addresses/:address`: Get wallet summary (balance & tx count).
- `GET /api/addresses/:address/balance`: Get just the balance.
- `GET /api/addresses/:address/transactions`: Get transaction history for an address.
- `POST /api/addresses/generate`: Create a new wallet (returns Public & Private key).
  - *Bonus*: Automatically gives 1000 LEMON coins for testing.

#### Mining & Stats
- `POST /api/mining/mine`: Trigger the mining process to confirm pending transactions.
- `GET /api/stats`: Global blockchain statistics (Supply, Total Blocks, Gas Price).

