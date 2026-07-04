# EcoRevive - Environment Conservation & Rewards Platform

EcoRevive is a full-stack Next.js application designed to drive environmental conservation through:
- Tree plantation donations
- Recycling & waste management reports
- Reward points and leaderboard system

Our mission is to sustain tomorrow by empowering individuals and organizations to contribute to a greener planet.

---

## Features

- **Report Dashboard**: Submit recycling/waste reports with server-side Gemini AI classification and verification.
- **Tree Plantation Donations**: Contribute directly to reforestation projects via secure Razorpay checkout.
- **Rewards**: Earn eco-points for donations and contributions.
- **Leaderboard**: Recognizes top contributors in environment conservation.
- **User Profiles**: Secure authentication & user management with Clerk.
- **Impact Tracking**: Track trees planted, CO2 reduced, and waste recycled.

---

## Tech Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Mongoose
- **Database**: MongoDB
- **Auth**: Clerk
- **Payments**: Razorpay Node.js SDK
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **UI Components**: shadcn/ui + Lucide Icons

---

## Security & Payment Integrity Implementation

The platform has been secured and hardened with the following integrations:
1. **Server-Side API Keys**: All sensitive environment variables (such as Gemini API key, MongoDB connection string, and Razorpay secrets) are isolated to the server context and excluded from client bundles.
2. **Server-Side AI Classification**: Image processing and waste classification requests are handled server-side at `/api/report/classify` to prevent API key exposure.
3. **Razorpay Signature & Amount Authority**: Payments are verified using HMAC-SHA256 signature checks on the server. The donation amount is queried directly from Razorpay via the Order ID to prevent client-side price manipulation.
4. **Idempotency Guard**: Webhook requests at `/api/donation/webhook` implement deduplication checks to ensure a donation event is never processed more than once.

---

## Environment Variables Configuration

Create a `.env.local` file in the root of the project with the following configuration:

```env
# Database
MONGODB_URL=your_mongodb_connection_string

# Base Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CURRENCY=INR

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## Testing

Unit tests for payment verification and webhook processing are located in the `__tests__` directory. You can run them using Jest:
```bash
npm test
```
