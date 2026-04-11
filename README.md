# FoodHub - Delicious Meals Delivered 🍔

FoodHub is a modern, full-stack food ordering platform designed for a premium user experience. It connects local food providers with hungry customers through a sleek, responsive interface built with Next.js 15, TypeScript, and Tailwind CSS.

## 🔗 Links
- 🎥 **YouTube Live Demo:** [Watch on YouTube](https://youtu.be/rQG12Q9-gj8)
- 🌐 **Live Website (Frontend):** [FoodHub Vercel App](https://foodhub-frontend-sand.vercel.app/)
- ⚙️ **Live API (Backend):** [FoodHub API](https://foodhub-backend-silk.vercel.app/)
- 💻 **Frontend Repository:** [GitHub - Frontend](https://github.com/wasif23ahad/foodHub-frontend)
- 🖥️ **Backend Repository:** [GitHub - Backend](https://github.com/wasif23ahad/foodHub-backend)

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
## 🛠️ What I Did: Frontend
The frontend is engineered to look visually stunning and provide instantaneous feedback.

- **Framer Motion Animations**: Every page uses complex, buttery-smooth transition animations, staggered list rendering, and micro-interactions.
- **State Management & Caching**: Engineered a robust data layer using **TanStack React Query**. Implemented sophisticated cache invalidation rules so that dashboard statistics immediately reflect when an order status is updated.
- **Zustand Persistent Cart**: The cart utilizes local storage via Zustand to ensure users never lose their items during accidental page reloads.
- **Type-Safe Forms**: Deep integration of `React Hook Form` and `Zod` validation for secure sign-in, sign-up, and provider profiling.
- **Vercel Deployment Patches**: Deployed effectively on Vercel handling edge-cases like Decimal deserialization from Prisma and resolving cross-site cooking issues.

## ⚙️ What I Did: Backend
The backend isn't just an API; it enforces strict business rules and protects data integrity.

- **Fully Typed API**: Express.js enriched with strict TypeScript models and Zod validation middleware.
- **Better-Auth Integration**: Leveraged the `better-auth` library to handle fortified, secure, cookie-based sessions avoiding standard JWT pitfalls.
- **Advanced Prisma Database Modeling**: Managed complex PostgreSQL relationships. Ensured **Cascade Deletion** protocols were properly enforced across the schema (e.g. deleting a Provider securely auto-cleans all `meals`, `orders`, and historical `orderItems` without throwing `P2003` constraint errors).
- **Cloudinary Image Uploads**: Built a custom multi-part form upload router to securely stream meal photos and provider logos up to the cloud.
- **Strict Role Middlewares**: Developed custom Express middleware to ensure a customer could never spoof an API call to a provider-only or admin-only endpoint.

---

## 💻 Tech Stack Overview
| **Frontend** | **Backend** | **Tools & Deployment** |
|--------------|--------------|------------------------|
| Next.js 15 (React 19) | Node.js (Express.js) | Git / GitHub |
| Tailwind CSS & shadcn/ui | TypeScript | Vercel |
| Zustand | Prisma ORM | Neon Serverless Postgres |
| TanStack React Query | PostgreSQL | Postman |
| Framer Motion | Better-Auth & Zod | Cloudinary |

## 📂 Repository Structure

```text
/
├── backend/            # Express.js REST API
│   ├── src/
│   │   ├── controllers/# Route Logic
│   │   ├── middlewares/# Auth & Validation Interceptors
│   │   ├── services/   # Prisma DB queries and business logic
│   │   └── validations/# Zod Schemas
│   └── prisma/         # PostgreSQL schema.prisma models
│
└── frontend/           # Next.js Application
    ├── src/
    │   ├── app/        # App Router Pages & Layouts
    │   ├── components/ # Reusable UI architecture
    │   ├── lib/        # API wrapper & utilities
    │   └── stores/     # Zustand state
```

## 📝 License
This project is licensed under the MIT License.
