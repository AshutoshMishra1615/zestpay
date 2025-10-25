# Firebase Setup Guide

## ❌ Error: `auth/operation-not-allowed`

This error means **Email/Password authentication is not enabled** in your Firebase project.

## ✅ Quick Fix (5 minutes)

### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (zestpay)
3. Click **"Authentication"** in the left sidebar
4. Click **"Sign-in method"** tab at the top
5. Find **"Email/Password"** in the list
6. Click on it to expand
7. **Toggle the first switch to ENABLE** (Email/Password)
8. Click **"Save"**

### Step 2: Set Up Firestore Security Rules

1. In Firebase Console, click **"Firestore Database"** in the left sidebar
2. Click the **"Rules"** tab
3. Replace the rules with this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Companies collection - admins can read/write their own company
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == companyId;
    }

    // Employees collection - users can read/write their own employee doc
    match /employees/{employeeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     (request.auth.uid == employeeId ||
                      get(/databases/$(database)/documents/employees/$(employeeId)).data.companyId == request.auth.uid);
      allow create: if request.auth != null;
    }

    // Withdrawals collection
    match /withdrawals/{withdrawalId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Repayments collection
    match /repayments/{repaymentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

### Step 3: Run the Setup Again

1. Refresh your browser at `http://localhost:3000/setup-test-data`
2. Click **"Setup Test Data"** button
3. Wait for completion

## 🎯 What This Fixes

✅ Allows creating users with email/password
✅ Allows writing to Firestore collections
✅ Secures your database (only authenticated users can access)
✅ Prevents unauthorized access

## 🔐 Security Rules Explained

- **Companies**: Only the company admin (whose UID matches companyId) can modify
- **Employees**: Users can modify their own profile, or their company admin can
- **Withdrawals**: Any authenticated user can read/create/update
- **Repayments**: Any authenticated user can read/create/update

## 🆘 Still Getting Errors?

### Error: "Missing or insufficient permissions"

**Cause**: Firestore rules not set up correctly
**Fix**: Follow Step 2 above to update Firestore rules

### Error: "Firebase: Error (auth/email-already-in-use)"

**Cause**: Test accounts already exist
**Fix**:

1. Go to Firebase Console → Authentication → Users
2. Delete all existing test users
3. Go to Firestore Database → Data
4. Delete documents in `companies`, `employees`, and `withdrawals` collections
5. Run setup again

### Error: "Network request failed"

**Cause**: Firebase configuration issue
**Fix**:

1. Check your `.env.local` file has correct Firebase credentials
2. Verify your Firebase project is active
3. Check your internet connection

## 📋 After Setup Checklist

Once setup completes successfully, verify:

- [ ] Firebase Console → Authentication → Users shows 6 users
- [ ] Firebase Console → Firestore → companies has 1 document
- [ ] Firebase Console → Firestore → employees has 5 documents
- [ ] Firebase Console → Firestore → withdrawals has 2 documents
- [ ] You can login at `/login` with test credentials
- [ ] Password for all accounts is: `Test@123`

## 🚀 Test Credentials

After successful setup, use these to test:

**Company Admin:**

```
Email: admin@testcompany.com
Password: Test@123
```

**Employee (with subscription):**

```
Email: john.doe@testcompany.com
Password: Test@123
```

**Employee (no subscription):**

```
Email: bob.johnson@testcompany.com
Password: Test@123
```

## 🔄 Alternative: Manual Setup

If the automated setup still doesn't work, you can manually create test data:

### 1. Create Company Admin Manually

1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Email: `admin@testcompany.com`
4. Password: `Test@123`
5. Copy the UID
6. Go to Firestore Database
7. Create a document in `companies` collection with that UID
8. Add fields:
   - name: "Test Company Inc."
   - domain: "testcompany.com"
   - email: "admin@testcompany.com"
   - industry: "Technology"
   - size: "50-200 employees"
   - totalEmployees: 0
   - totalDisbursed: 0

### 2. Create Employees Manually

Repeat the process for each employee email:

- `john.doe@testcompany.com`
- `jane.smith@testcompany.com`
- `bob.johnson@testcompany.com`
- `alice.williams@testcompany.com`
- `charlie.brown@testcompany.com`

Then create documents in `employees` collection with their respective data.

## 📞 Need More Help?

Check `TESTING_GUIDE.md` for detailed testing instructions after setup.
