# Sahayak

Sahayak is a full-stack crowdfunding platform built to make raising funds easy, transparent, and secure. Whether it&apos;s for medical emergencies, education, or disaster relief, this app lets users create campaigns and accept donations smoothly.

## What it does

- **Create Campaigns:** Anyone can start a fundraiser, add a compelling story, and set a target goal.
- **Secure Donations:** Fully integrated with Razorpay so payments are handled safely and quickly.
- **Dashboard & Tracking:** Keep track of how much has been raised, see recent donations, and manage active campaigns in real-time.
- **Clean UI:** Built with Tailwind CSS to keep things looking modern and working perfectly on mobile.

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB (using Mongoose)
- **Auth:** NextAuth.js
- **Payments:** Razorpay

## Running it locally

If you want to spin this up on your own machine, here's how:

1. **Clone and install**
   ```bash
   git clone https://github.com/your-username/sahayak.git
   cd sahayak
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory and drop in your keys:
   ```env
   # Razorpay Keys
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_public_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/sahayak

   # NextAuth
   NEXTAUTH_SECRET=your_auth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Google Auth (if using Google Sign-in)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Start the server**
   Make sure MongoDB is running (locally or via an Atlas URI), then start the dev server:
   ```bash
   npm run dev
   ```
   The app should now be running at `http://localhost:3000`.

## How the Payment Flow Works

If you&apos;re curious about how the donations are processed:
1. The user enters their details and the donation amount.
2. The frontend hits `/api/create-order` to generate a secure Razorpay order.
3. The Razorpay checkout modal pops up for the user to complete the transaction.
4. Once paid, Razorpay sends back a signature. We verify this on our backend (`/api/verify-payment`) using the secret key to ensure nobody tampered with it.
5. If everything checks out, we save the payment record to MongoDB and update the fundraiser's total raised amount.

## Project Structure

A quick map of where everything lives:
- `app/api/` - Backend routes (Razorpay checkout, verification, data fetching).
- `app/` - Frontend pages (dashboard, payment flow, fundraiser creation).
- `models/` - Mongoose schemas (`User`, `Payment`, `Fundraiser`).
- `components/` - Reusable UI components like cards, navbars, and buttons.
- `lib/` - Utility functions and database connection logic.

## Deployment

The app is optimized for Vercel. Just connect your GitHub repo, add your production environment variables in the Vercel dashboard, and hit deploy. 

---


