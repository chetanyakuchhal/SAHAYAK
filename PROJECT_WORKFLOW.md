# Sahayak Project Workflow Documentation

## 1) Project Overview
Sahayak is a Next.js (App Router) crowdfunding app with MongoDB and Razorpay integration.

Main goals:
- User authentication (NextAuth)
- Fundraiser creation and listing
- Donation payment and verification
- Dashboard visibility of campaigns and payments

## 2) High-Level Architecture
- Frontend pages: `app/*`
- API routes: `app/api/*`
- Database models: `models/*`
- DB connection: `lib/mongodb.js` and `utils/db.js`
- Shared UI components: `components/*`

## 3) Core User Workflows

### A. Signup/Login Workflow
1. User opens signup/login pages (`app/signup/page.js`, `app/login/page.js`).
2. Credentials are validated via API/Auth flow.
3. Session is managed by NextAuth (`app/api/auth/[...nextauth]/route.js`).
4. Authenticated user can access dashboard.

### B. Fundraiser Creation Workflow
1. User goes to fundraiser form (`app/fundraiser-form/page.js` or `app/form/page.js`).
2. Form submits `POST /api/get-fundraisers` with:
   - `title`
   - `description`
   - `neededAmount`
   - `documentName` (file name only)
3. API route validates payload and stores data in MongoDB using `Fundraiser` model.
4. On success, user is redirected to dashboard.

### C. Fundraiser Listing Workflow
1. Dashboard (`app/dashboard/page.js`) calls `GET /api/get-fundraisers`.
2. API fetches latest records from MongoDB sorted by `createdAt` descending.
3. Dashboard renders:
   - Title
   - Description
   - Needed amount (`amountNeeded`)
   - Raised amount (`amountRaised`)

### D. Payment Workflow
1. User starts payment from payment page/component.
2. App creates Razorpay order through `POST /api/create-order`.
3. After payment, app sends verification payload to `POST /api/verify-payment`.
4. Verification route:
   - Validates signature
   - Prevents duplicate entry
   - Stores payment in `Payment` collection
5. Dashboard fetches recent donations from `GET /api/get-payments`.

## 4) API Contract Summary
- `GET /api/get-fundraisers`
  - Returns latest fundraiser list.

- `POST /api/get-fundraisers`
  - Creates a fundraiser.
  - Required: `title`, `description`, `neededAmount`

- `GET /api/get-payments`
  - Returns latest payments.

- `POST /api/create-order`
  - Creates Razorpay order.

- `POST /api/verify-payment`
  - Verifies Razorpay signature and stores payment.

## 5) Data Models

### Fundraiser (`models/Fundraiser.js`)
- `title: String`
- `description: String`
- `amountNeeded: Number`
- `amountRaised: Number`
- `documentName: String`
- `createdAt: Date`

### Payment (`models/Payment.js`)
- donor details
- amount
- fundraiser label
- order/payment IDs
- status
- createdAt

### User (`models/User.js`)
- Stores auth/profile information for signed-up users.

## 6) Environment Variables
Typical required variables:
- `MONGODB_URI`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- NextAuth-related secrets/providers as configured

## 7) Development Runbook
1. Install deps:
   - `npm install`
2. Add `.env.local` with required keys.
3. Start dev server:
   - `npm run dev`
4. Test flows:
   - Signup/Login
   - Create fundraiser
   - Confirm dashboard listing
   - Payment + verification

## 8) Common Debug Checklist
If fundraiser is not visible:
1. Check browser Network tab: `POST /api/get-fundraisers` should return success.
2. Check API logs for validation/database errors.
3. Check `MONGODB_URI` and DB connection logs.
4. Check dashboard calls `GET /api/get-fundraisers` successfully.
5. Ensure UI uses `amountNeeded/amountRaised` fields (not `needed/raised`).

If payment not visible:
1. Check `POST /api/verify-payment` response.
2. Confirm signature validation passes.
3. Check `GET /api/get-payments` output.

## 9) Suggested Next Improvements
- Add fundraiser owner identity (user ID/email) in schema.
- Add real file upload storage for documents (S3/Cloudinary).
- Add form-level validation + backend schema validation.
- Add tests for API routes and dashboard rendering.
