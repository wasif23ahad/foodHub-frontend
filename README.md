# FoodHub - Delicious Meals Delivered 🍔

FoodHub is a modern, full-stack food ordering platform designed for a premium user experience. It connects local food providers with hungry customers through a sleek, responsive interface built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Key Features

### 🛒 For Customers
- **Comprehensive Catalog**: Browse meals by category, price, and rating.
- **Interactive Search**: Real-time debounced search for finding exactly what you craving.
- **Persistent Cart**: Powered by Zustand with local storage persistence.
- **Secure Checkout**: Seamless ordering process with delivery address management.
- **Order History**: Track your current and past orders with status updates.

### 🏪 For Providers
- **Menu Management**: Full CRUD operations for adding, editing, and deleting meals.
- **Live Inventory**: Toggle meal availability in real-time.
- **Provider Dashboard**: Track revenue and orders specific to your business.

### 🛡️ For Admins
- **Global Overview**: High-level stats on system revenue, users, and orders.
- **User Management**: Block/unblock users and manage roles (Customer, Provider, Admin).
- **System Activity**: Monitor recent orders and provider requests.

## 🎨 Design & UX
- **Framer Motion Animations**: Smooth page transitions, staggered entrance effects, and interactive hover states.
- **Professional Loading States**: High-quality skeleton loaders replaced basic spinners for a polished feel.
- **Robust Error Handling**: Global error boundaries and custom 404 pages ensure a resilient user experience.
- **Responsive Theme**: A modern red/slate theme optimized for all devices.

## 🛠️ Tech Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ 
- npm / pnpm / yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://foodhub-backend-silk.vercel.app/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📂 Project Structure
```text
src/
├── app/            # Next.js App Router (Pages & Layouts)
├── components/     # Reusable UI & Business Components
├── hooks/          # Custom React hooks (debounce, auth, etc.)
├── lib/            # Utility functions & API client
├── stores/         # Zustand state stores (cart, etc.)
├── types/          # TypeScript interface definitions
└── styles/         # Global CSS and Tailwind configuration
```

## 📝 License
This project is licensed under the MIT License.
