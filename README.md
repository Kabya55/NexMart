# NexMart 🛒

NexMart is a Premium Tech Listings & Smart Gadgets Store. It is a full-stack e-commerce and gadget listing platform built with the latest web technologies, offering users a seamless experience to explore, watch, and manage premium tech products.

## 🚀 Features

- **Modern Tech Stack**: Built with [Next.js 16](https://nextjs.org/) (App Router) and React 19.
- **Secure Authentication**: Integrated with [Better Auth](https://better-auth.com/) for reliable and secure authentication, featuring Google OAuth and credential-based login.
- **Database**: Powered by [MongoDB](https://www.mongodb.com/) for fast and scalable data storage.
- **Responsive Design**: Beautiful, responsive, and modern UI crafted with [Tailwind CSS v4](https://tailwindcss.com/).
- **User Dashboard**: Personalized dashboard for users to track their favorite gadgets and manage their watchlist.
- **Role-based Access**: Admin and standard user roles to separate management functionalities from basic user features.

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
