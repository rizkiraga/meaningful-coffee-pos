# Meaningful Coffee POS ☕

A modern, full-stack Point of Sale (POS) application built for coffee shops. This project demonstrates a comprehensive understanding of modern web development practices, focusing on performance, user experience, and real-world functionality.

![Dashboard Preview](https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000)
*(Note: Replace with actual screenshot of your dashboard)*

## 🚀 Features

- **Point of Sale (POS) Interface**: Fast and intuitive interface for cashiers to process orders.
  - Product categorization (Coffee, Non-Coffee, Snacks).
  - Real-time cart management with tax calculation.
  - Multiple payment methods (Cash, QRIS).
  - **Receipt Generation**: Automatic thermal-printer style receipt preview and printing.
- **Dashboard & Analytics**: Real-time insights into business performance.
  - Sales charts and trends.
  - Top-selling products.
  - Key metrics (Revenue, Orders, Average Order Value).
  - **Date Filtering**: Analyze data by daily, monthly, or custom date ranges.
- **Order Management**: Comprehensive history of all transactions.
  - Status tracking.
  - **Excel Export**: Download detailed financial reports for accounting.
- **Menu Management**: CRUD operations for managing products.
- **Responsive Design**: Fully optimized for tablets and desktop screens.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Hooks & LocalStorage (for demo persistence)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Export**: [SheetJS (xlsx)](https://sheetjs.com/)

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/meaningful-coffee-pos.git
   cd meaningful-coffee-pos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💡 Key Highlights for Reviewers

- **Component Architecture**: Modular and reusable components (e.g., `ProductCard`, `StatsCard`, `Sidebar`).
- **Client-Side Persistence**: Uses `localStorage` to simulate a backend database, allowing full feature demonstration without server setup.
- **Type Safety**: Full TypeScript implementation for robust code quality.
- **UX Details**: Custom toast notifications, loading states, and smooth transitions.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
