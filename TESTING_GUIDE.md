# ZestPay Test Data Setup Guide

## Quick Start - Using the Web Setup Page

The easiest way to set up test data is using the built-in web interface:

1. **Start your development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to the setup page:**

   ```
   http://localhost:3000/setup-test-data
   ```

3. **Click the "🚀 Setup Test Data" button**

   - This will automatically create all test accounts and sample data
   - Wait for the "Setup Complete!" message

4. **Use the test credentials to login:**

## Test Credentials

### Password (same for all accounts)

```
Test@123
```

### Company Admin

```
Email: admin@testcompany.com
Role: Company Administrator
Access: /company/dashboard
```

### Employees (WITH Subscription)

```
1. john.doe@testcompany.com
   - Department: Engineering
   - Salary: ₹50,000/month
   - Trust Score: 75%
   - Has active subscription
   - Has sample withdrawal history

2. jane.smith@testcompany.com
   - Department: Marketing
   - Salary: ₹45,000/month
   - Trust Score: 85%
   - Has active subscription

3. alice.williams@testcompany.com
   - Department: Sales
   - Salary: ₹55,000/month
   - Trust Score: 90%
   - Has active subscription
```

### Employees (WITHOUT Subscription - for testing payment flow)

```
1. bob.johnson@testcompany.com
   - Department: Engineering
   - Salary: ₹60,000/month
   - Trust Score: 65%
   - No subscription (test payment modal)

2. charlie.brown@testcompany.com
   - Department: Support
   - Salary: ₹48,000/month
   - Trust Score: 70%
   - No subscription (test payment modal)
```

## Test Scenarios

### 1. Company Admin Dashboard

- Login as: `admin@testcompany.com`
- Test:
  - View all employees
  - Add new employees
  - Approve/reject withdrawal requests
  - View company stats

### 2. Employee with Subscription

- Login as: `john.doe@testcompany.com`
- Test:
  - View dashboard (should show all features unlocked)
  - See withdrawal history (has 2 sample withdrawals)
  - Request new withdrawal
  - View trust score and available amount

### 3. Employee without Subscription

- Login as: `bob.johnson@testcompany.com`
- Test:
  - Dashboard loads but features are locked
  - Payment modal appears
  - Test fake Razorpay payment
  - Features unlock after payment

### 4. New Employee Registration

- Use email ending with: `@testcompany.com`
- Example: `newemployee@testcompany.com`
- Test:
  - Registration with email verification
  - Company domain validation
  - Auto-profile creation

## Sample Data Created

### Withdrawals

- **John Doe** has:
  - 1 approved withdrawal: ₹10,000 (10 days ago)
  - 1 pending withdrawal: ₹5,000 (2 days ago)

### Trust Scores

- Trust scores range from 65% to 90%
- Determines maximum withdrawal amount
- Formula: `(Monthly Salary × Trust Score%) - Already Withdrawn`

## Testing Features

### EWA (Earned Wage Access)

1. Login as subscribed employee
2. Click "Request Withdrawal"
3. Enter amount within available limit
4. Submit and check status

### Subscription Payment

1. Login as non-subscribed employee (bob or charlie)
2. Click "Activate Now" banner
3. Test fake payment flow
4. Verify features unlock

### Company Operations

1. Login as company admin
2. Add employee manually
3. Bulk upload via CSV
4. Approve/reject withdrawals
5. View employee trust scores

## Cleaning Up Test Data

To remove all test data and start fresh:

1. Go to Firebase Console
2. Firestore Database
3. Delete collections:
   - `companies`
   - `employees`
   - `withdrawals`
4. Authentication → Users
5. Delete all test users
6. Re-run the setup page

## Troubleshooting

### "Email already in use" Error

- Test data already exists
- Either use existing credentials or clean up first

### "Company domain not registered" during registration

- Make sure to use `@testcompany.com` domain
- Setup page must be run first

### Email verification not working

- Check Firebase Console → Authentication → Templates
- Test accounts are created with `emailVerified: true`

### Features still locked after payment

- Refresh the page
- Check browser console for errors
- Verify `hasSubscription` field in Firestore

## API Testing with Postman/Thunder Client

Company Admin Token endpoint:

```
POST http://localhost:3000/api/auth/login
{
  "email": "admin@testcompany.com",
  "password": "Test@123"
}
```

## Firebase Rules Required

Make sure your Firestore rules allow:

- Authenticated users can read/write their own employee document
- Company admins can read/write all employees in their company
- Employees can create withdrawal requests
- Company admins can approve/reject withdrawals

## Next Steps

After setting up test data:

1. ✅ Test employee login flow
2. ✅ Test company admin panel
3. ✅ Test withdrawal requests
4. ✅ Test subscription payment
5. ✅ Test new employee registration
6. ✅ Test trust score calculations
7. ✅ Test email verification

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Firebase Console for data
3. Verify environment variables in `.env.local`
4. Ensure Firebase config is correct

## Important Notes

- **DO NOT** use this setup in production
- Test data uses simple passwords
- Fake payment integration (Razorpay simulation)
- Email verification is auto-approved for test accounts
- Trust scores are randomly assigned (not calculated)
