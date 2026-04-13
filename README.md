# School Payment Portal

A comprehensive school payment management system built with Next.js, TypeScript, Supabase, and Tailwind CSS.

**⚠️ Private Project** - This is a private project for internal use only. All team members use the shared Supabase configuration.

## Features

- **Student Management**: Add, edit, and manage student records
- **Fee Management**: Configure class fees, hostel fees, and NECO exam fees
- **Payment Tracking**: Track student payments, balances, and payment history
- **Bank Accounts**: Manage bank accounts for payments
- **Admin Dashboard**: Overview of payment statistics and student data
- **Parent Portal**: View student payment status and payment history
- **SS3 Special Handling**: Dedicated hostel fee and NECO exam fee for final-year students
- **Term Reset**: Reset payment statuses for new terms (excludes SS3 students)

## Quick Start (1 Command)

```bash
git clone https://github.com/WeavreApp/payment-portal-ota.git
cd payment-portal-ota
npm install
npm run dev
```

That's it! `npm install` automatically runs setup which:
- Loads Supabase credentials from `.env.local` (already in repo)
- Tests database connection
- Runs all database migrations
- Seeds fee rates and settings
- You're ready to go!

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

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
