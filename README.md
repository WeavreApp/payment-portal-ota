# School Payment Portal

A comprehensive school payment management system built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Features

- **Student Management**: Add, edit, and manage student records
- **Fee Management**: Configure class fees, hostel fees, and NECO exam fees
- **Payment Tracking**: Track student payments, balances, and payment history
- **Bank Accounts**: Manage bank accounts for payments
- **Admin Dashboard**: Overview of payment statistics and student data
- **Parent Portal**: View student payment status and payment history
- **SS3 Special Handling**: Dedicated hostel fee and NECO exam fee for final-year students
- **Term Reset**: Reset payment statuses for new terms (excludes SS3 students)

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI components, Lucide icons
- **Backend**: Supabase (PostgreSQL database, Auth, Storage)
- **Forms**: React Hook Form, Zod validation
- **Charts**: Recharts

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/WeavreApp/payment-portal-ota.git
cd payment-portal-ota
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to **Settings → API** and copy:
   - Project URL
   - Anon public key
   - Service role key (for migrations)

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and replace with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

### 5. Run database migrations

The project includes 18 database migrations that set up the complete schema:

```bash
# Option 1: Using setup script (recommended)
npm run setup-database

# Option 2: Using Supabase CLI
npx supabase db push

# Option 3: Manually via Supabase Dashboard
# Go to SQL Editor and run each migration file from supabase/migrations/
```

**Migration files** (in order):
1. `20260403024253_create_school_payment_schema.sql` - Core schema
2. `20260403024304_create_storage_bucket.sql` - Storage setup
3. `20260403091613_add_superadmin_role_and_rbac.sql` - Admin roles
4. `20260403101906_add_student_type_and_misc_payments.sql` - Student types
5. `20260403110551_fix_lookup_student_and_trigger.sql` - Triggers
6. `20260404153200_password_reset_requests.sql` - Password reset
7. `20260404160000_class_structure.sql` - Class structure
8. `20260405163000_add_misc_items_description.sql` - Misc items
9. `20260405173000_create_fee_management.sql` - Fee management
10. `20260405174000_add_mindcraft_config.sql` - Mindcraft config
11. `20260405220000_update_class_fee_rates.sql` - Class fee rates
12. `20260405230000_remove_mindcraft_settings.sql` - Cleanup
13. `20260406000000_add_payment_tracking.sql` - Payment tracking
14. `20260411000000_add_bank_accounts.sql` - Bank accounts
15. `20260412000000_add_neco_fee_column.sql` - NECO fee
16. `20260412000001_add_ss3_hostel_fee_setting.sql` - SS3 hostel fee

### 6. Seed database with sample data (optional)

To populate the database with sample fee rates, bank accounts, and settings:

```bash
npm run seed-database
```

This will add:
- Default fee settings (hostel fees, NECO fee)
- Class fee rates for all classes (JSS, SS, Primary)
- Sample bank accounts

### 7. Create initial admin user

After migrations, create a super admin user:

```bash
# Via Supabase SQL Editor
INSERT INTO profiles (id, email, role, full_name)
VALUES (gen_random_uuid(), 'admin@school.com', 'superadmin', 'School Admin');

-- Then create auth user via Supabase Dashboard → Authentication
```

### 8. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials

After setup, create your first admin user via Supabase Dashboard:
- Email: (your admin email)
- Password: (set during creation)
- Role: superadmin

## Fee Structure

The system supports different fee structures:

- **Day Students**: Pay only tuition fee
- **Boarding Students**: Pay tuition + hostel fee
- **SS3 Boarding Students**: Pay tuition + SS3 hostel fee (₦750,000) + optional NECO fee (₦40,000)
- **SS3 Day Students**: Pay tuition + optional NECO fee

## Class Structure

**Junior Secondary:**
- JSS 1A, JSS 1B, JSS 1C, JSS 1D
- JSS 2A, JSS 2B, JSS 2C, JSS 2D
- JSS 3A, JSS 3B, JSS 3C, JSS 3D

**Senior Secondary:**
- SS 1A, SS 1B, SS 1C, SS 1D
- SS 2A, SS 2B, SS 2C, SS 2D
- SS 3A, SS 3B, SS 3C

**Primary:**
- Pre-School
- Primary 1-6

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

The project includes `netlify.toml` for Netlify deployment.

## Database Schema

Key tables:
- `students` - Student records
- `payments` - Payment transactions
- `class_fee_rates` - Fee configuration by class
- `fee_settings` - Global fee settings (hostel fees, NECO fee)
- `bank_accounts` - Bank account information
- `profiles` - User profiles with roles

## Security

- Row Level Security (RLS) enabled on all tables
- Super admin role for full access
- Service role key required for database operations
- Environment variables for sensitive data

## Troubleshooting

### Migration errors
- Ensure Supabase project is active
- Check that service role key is correct
- Run migrations in order

### Build errors
- Delete `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Auth errors
- Check environment variables are set correctly
- Verify Supabase project is active
- Check user role in profiles table

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

## License

Proprietary - WeavreApp

## Support

For issues or questions, contact the development team.
