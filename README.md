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
