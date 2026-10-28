# TimeTrack Asia

TimeTrack is a comprehensive sports event management and timing platform for running events in Malaysia. Built with Next.js 16, React 19, TypeScript, and Supabase.

## Features

- **Event Management** - Create and manage running events with categories, pricing, and registration periods
- **Registration System** - Athletes can register for events with participant details and add-ons
- **Payment Integration** - CHIP payment gateway integration for secure transactions
- **Results & Certificates** - Import race results, generate rankings, and issue certificates
- **Role-Based Access** - Support for Athletes, Organizers, Staff, Admins, and Developers
- **Coupon System** - Discount codes for early bird and promotional pricing
- **Billing & Invoices** - Automatic invoice generation for registrations

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript, Tailwind CSS v4
- **UI Components:** Base UI, shadcn/ui, Radix UI
- **Backend:** Supabase (PostgreSQL with Row Level Security)
- **State Management:** TanStack Query
- **Forms:** React Hook Form with Zod validation
- **Payments:** CHIP Collect API

## Development

```bash
npm install
npm run dev
```

The app supports both Supabase (production) and a local mock backend for development via `USE_LOCAL_BACKEND=true`.

## User Manual

### For Athletes

1. **Create an Account** - Sign up at `/signup` with your email and password. All public signups are created as athletes by default.
2. **Browse Events** - View all live events on the homepage or `/events`. Each event card shows the date, venue, and registration status.
3. **Register for an Event** - Click on an event to view details, select a category, add participant information, choose add-ons (if available), apply a coupon code if you have one, and proceed to payment.
4. **Complete Payment** - You'll be redirected to CHIP payment gateway to complete your registration. Once paid, your registration status becomes confirmed.
5. **View Registrations** - Go to `/profile` to see all your registrations, download invoices, and view registration details.
6. **Check Results** - After an event is completed and results are finalized, view them at `/results`. You can search by event, category, or bib number.
7. **Download Certificates** - If your result has been processed, you can download your certificate from your registration details or results page.

### For Organizers

1. **Become an Organizer** - Sign up with an organizer access code provided by an admin. The code is required during registration.
2. **Access Organizer Dashboard** - Log in and navigate to `/organizer/dashboard` to manage your events.
3. **Create an Event** - Click "Create Event" to set up a new event with details like title, date, venue, registration period, categories, and pricing.
4. **Manage Categories & Add-ons** - Add race categories (e.g., 5K, 10K, Half Marathon) with different prices and slot limits. Add optional add-ons like t-shirts or merchandise.
5. **Manage Registrations** - View all registrations for your events, check participant details, and track payment status.
6. **Import Results** - Go to "Results" in your dashboard to import race results (CSV/Excel) after the event.
7. **Finalize Results** - After importing, finalize results to publish them publicly and enable certificate generation.
8. **Manage Coupons** - Create discount coupons for your events with usage limits and expiration dates.

### For Staff

1. **Access** - Staff members are assigned to events by organizers or admins.
2. **Check-in Participants** - Use the event check-in interface to verify participants on race day using their QR code or bib number.

### For Admins

1. **Access Admin Dashboard** - Navigate to `/admin/dashboard` for system-wide management.
2. **Manage Users** - View and manage all users, update roles, and activate/deactivate accounts.
3. **Manage Events** - Oversee all events across the platform, approve/reject event submissions.
4. **Manage Coupons** - Create and manage system-wide or organizer coupons.
5. **View Audit Logs** - Monitor system activity through audit logs.
6. **Manage Payments** - Review payment transactions and handle refunds if necessary.

### For Developers

1. **Access Developer Dashboard** - Navigate to `/developer/dashboard` for system configuration and monitoring.
2. **System Management** - Access advanced system settings and developer tools.

### Tips & Notes

- **Registration Period** - You can only register for events during their open registration period.
- **Payment Timeout** - Pending registrations may expire if payment is not completed within the time limit.
- **Bib Numbers** - Bib numbers are assigned upon successful payment confirmation.
- **Results Publication** - Results are only visible after the organizer finalizes them.
- **Contact Support** - For issues, use the contact form at `/contact`.

