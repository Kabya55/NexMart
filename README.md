# NexMart 🛒

NexMart is a Premium Tech Listings & Smart Gadgets Store. It is a full-stack e-commerce and gadget listing platform built with the latest web technologies, offering users a seamless experience to explore, watch, and manage premium tech products.

## 🚀 Features

NexMart offers a rich set of features tailored specifically for both general users and administrators, ensuring a seamless shopping and management experience.

### 👤 For General Users
- **Secure Authentication**: Sign up and log in securely using Email/Password or **Google OAuth** (powered by Better Auth).
- **Personalized Dashboard**: A dedicated user dashboard to manage personal details and track activities.
- **Explore Gadgets**: Browse through a wide variety of premium tech listings and smart gadgets.
- **Watchlist Management**: Add favorite items to your personal watchlist to monitor prices and availability. You can easily add or remove items from your dashboard.
- **Interactive UI**: Enjoy a modern, responsive, and aesthetically pleasing interface with smooth animations.
- **Detailed Product Views**: View comprehensive details, images, and specifications of every listed gadget.

### 👑 For Administrators (Admins)
- **Admin Dashboard**: A comprehensive admin panel to oversee the entire platform.
- **Manage Listings**: Full CRUD (Create, Read, Update, Delete) capabilities to add new gadgets, update existing product details, and remove outdated items.
- **Platform Analytics**: Track overall marketplace metrics, total listings, and active users right from the dashboard.
- **Access Control**: Secure role-based access ensuring only admins can modify or delete core platform data.

### 🛠️ Technical Highlights
- **Framework**: Built with [Next.js 16](https://nextjs.org/) (App Router) and React 19.
- **Authentication**: Integrated with [Better Auth](https://better-auth.com/) for reliable session management.
- **Database**: Powered by [MongoDB](https://www.mongodb.com/) for fast and scalable data storage.
- **Styling**: Beautiful, responsive, and modern UI crafted with [Tailwind CSS v4](https://tailwindcss.com/).
## 🛠️ Getting Started

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm/bun) installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kabya55/NexMart.git
   cd NexMart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Better Auth Config
   BETTER_AUTH_SECRET=your_better_auth_secret
   BETTER_AUTH_URL=http://localhost:3000

   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

This project is configured and optimized for deployment on [Vercel](https://vercel.com/). Ensure that you add all the necessary environment variables in your Vercel project settings before deploying.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
