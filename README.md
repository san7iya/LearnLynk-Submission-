# LearnLynk-Submission

## Tech Stack

- **Frontend:** Next.js (TypeScript), React  
- **Backend:** Supabase Edge Functions (TypeScript, Deno)  
- **Database:** Supabase PostgreSQL  
- **Authentication & Security:** Supabase Auth + Row Level Security (RLS)  
- **Payments:** Stripe Checkout (Design Explanation)  
- **Deployment & Hosting:** Supabase + Local Next.js Dev Server  

---

## Assessment Overview

### Task 1 — Database Schema  
Designed three relational tables: `leads`, `applications`, and `tasks` with proper constraints, foreign keys, and performance-focused indexes for common queries.

### Task 2 — Row Level Security (RLS)  
Implemented multi-tenant access control using Supabase RLS. Counselors can access their own leads or team leads, while admins can access all tenant leads.

### Task 3 — Edge Function (create-task)  
Built a secure Supabase Edge Function to validate input, create tasks using a service role key, and return proper API responses with structured error handling.

### Task 4 — Frontend Dashboard  
Built a Next.js dashboard page to fetch tasks due today, exclude completed ones, display them in a table, and allow real-time status updates using Supabase.

### Task 5 — Stripe Checkout (Design)  
Designed a secure Stripe Checkout payment flow using backend session creation, database tracking, and webhook verification.

---

## Stripe Answer

When a user clicks “Pay Application Fee” on the frontend, the `application_id` is sent to the backend. The backend first creates a `payment_requests` row with status set to `pending` before calling Stripe. A Stripe Checkout Session is then created with the fee amount and metadata such as `application_id` and `payment_request_id`. The returned Stripe `session_id` is stored back in the `payment_requests` table. The frontend is redirected to the Stripe Checkout URL for secure payment. After payment, Stripe sends a `checkout.session.completed` webhook to the backend. The webhook signature is verified for authenticity. On successful verification, the `payment_requests` status is updated to `paid`, and the corresponding application is marked as `payment_completed`. This ensures payment confirmation is handled securely on the server and prevents fake success from the frontend.
