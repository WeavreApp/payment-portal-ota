# Bank Accounts Management System

## Overview

This system allows super admins to manage bank accounts that parents can use for school fee payments. The system provides flexible configuration for different student levels and payment types.

## Features

### For Super Admins
- **Add/Edit/Delete Bank Accounts**: Complete CRUD operations
- **Student Level Targeting**: Configure accounts for specific student levels
- **Payment Type Control**: Set which accounts accept tuition vs miscellaneous payments
- **Display Order Management**: Control the order accounts appear to parents
- **Active/Inactive Status**: Enable or disable accounts without deleting them

### For Parents
- **Filtered Display**: See only relevant accounts based on student's level
- **Payment Type Filtering**: View accounts that accept specific payment types
- **Copy Account Numbers**: Easy copying of account numbers
- **Clear Instructions**: Payment guidance included

## Database Schema

### Bank Accounts Table
```sql
CREATE TABLE bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_name text NOT NULL,
  account_number text NOT NULL,
  accepts_tuition boolean NOT NULL DEFAULT true,
  accepts_misc boolean NOT NULL DEFAULT true,
  student_level text NOT NULL DEFAULT 'all', -- 'primary', 'secondary', 'hostel', 'all'
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Student Levels
- `all`: Available to all students
- `primary`: Primary school students only
- `secondary`: Secondary school students only
- `hostel`: Hostel fees only

## Setup Instructions

### 1. Run Database Migration
Copy the contents of `supabase/migrations/20260411000000_add_bank_accounts.sql` and run it in Supabase SQL Editor.

### 2. Verify Setup
Run the verification script `scripts/setup-bank-accounts.sql` to confirm everything is working.

### 3. Access the Management Interface
Navigate to `/admin/bank-accounts` (only visible to super admins).

## Usage

### Adding a Bank Account
1. Click "Add Bank Account" button
2. Fill in the required fields:
   - Bank Name (e.g., "Access Bank")
   - Account Name (e.g., "Ota Total Academy")
   - Account Number (e.g., "0091234567")
   - Student Level (who can use this account)
   - Payment Types (tuition, misc, or both)
   - Display Order (for sorting)
3. Toggle "Active" status as needed
4. Click "Create"

### Editing a Bank Account
1. Click the "Edit" icon next to any account
2. Modify the fields as needed
3. Click "Update"

### Deleting a Bank Account
1. Click the "Delete" icon next to any account
2. Confirm the deletion in the dialog

### Parent Portal Display
The `BankAccountsDisplay` component automatically:
- Filters accounts by student level
- Shows payment type badges
- Provides copy functionality
- Displays payment instructions

## Security

### Access Control
- Only super admins can manage bank accounts
- RLS policies restrict database access
- All operations require superadmin role verification

### Public Access
- Parents can view accounts through the `get_bank_accounts()` function
- Function automatically filters by student level
- No direct table access for non-admin users

## API Functions

### get_bank_accounts(p_student_level)
Returns bank accounts filtered by student level for parent portal display.

### update_bank_account(...)
Updates an existing bank account (superadmin only).

### create_bank_account(...)
Creates a new bank account (superadmin only).

### delete_bank_account(p_id)
Deletes a bank account (superadmin only).

## Default Configuration

The system comes with 3 default bank accounts:
1. Access Bank - 0091234567
2. Zenith Bank - 1012345678
3. UBA - 2012345678

All default accounts accept both tuition and miscellaneous payments for all student levels.

## Integration Points

### Parent Portal
Use the `BankAccountsDisplay` component:
```tsx
<BankAccountsDisplay studentLevel="primary" paymentType="tuition" />
```

### Payment Processing
Bank account IDs can be associated with payments for tracking purposes.

## Troubleshooting

### Common Issues
1. **Access Denied**: Ensure user has superadmin role
2. **No Accounts Displayed**: Check if accounts are active and match student level
3. **Database Errors**: Verify migration was run successfully

### Verification Queries
```sql
-- Check table exists
SELECT * FROM information_schema.tables WHERE table_name = 'bank_accounts';

-- Check default accounts
SELECT * FROM bank_accounts ORDER BY display_order;

-- Test public function
SELECT * FROM get_bank_accounts('all');
```

## Future Enhancements

- Account validation (real bank account verification)
- QR code generation for easy payments
- Payment history per account
- Account usage analytics
- Bulk import/export functionality
