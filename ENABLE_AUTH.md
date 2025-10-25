# 🚨 QUICK FIX: Enable Email/Password Authentication

## The Error You're Seeing:

```
Setup failed: Firebase: Error (auth/operation-not-allowed)
```

## ✅ 3-Step Fix (Takes 2 minutes)

### Step 1: Open Firebase Console

Go to: **https://console.firebase.google.com/**

### Step 2: Enable Email/Password Auth

1. Click on your **"zestpay"** project
2. Click **"Authentication"** in the left sidebar (🔐 icon)
3. Click the **"Sign-in method"** tab at the top
4. Find **"Email/Password"** in the providers list
5. Click on it to open the settings
6. **Toggle ON the first switch** (Email/Password)
7. Click **"Save"**

### Step 3: Try Setup Again

1. Go back to: `http://localhost:3000/setup-test-data`
2. Refresh the page
3. Click **"Setup Test Data"** button
4. ✅ Should work now!

---

## 📸 Visual Guide

### What to look for in Firebase Console:

```
┌─────────────────────────────────────────────────────┐
│  Authentication                                      │
├─────────────────────────────────────────────────────┤
│  Users  │ Sign-in method │ Templates │ Settings     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Sign-in providers                                   │
│                                                      │
│  📧 Email/Password                    ⚫ Disabled   │  ← Click here
│  🔗 Google                             Disabled      │
│  📘 Facebook                           Disabled      │
│  🐦 Twitter                            Disabled      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

After clicking, you'll see:

```
┌─────────────────────────────────────────────────────┐
│  Email/Password                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Enable                                              │
│  [●─────] ON   ← Toggle this to ON                  │
│                                                      │
│  Email link (passwordless sign-in)                   │
│  [──────○] OFF  ← Leave this OFF                    │
│                                                      │
│                                    [Cancel] [Save]   │
│                                              ↑       │
└──────────────────────────────────────────────Click! ┘
```

---

## 🎯 After Enabling:

1. The status will change from **⚫ Disabled** to **🟢 Enabled**
2. Go back to your app at `http://localhost:3000/setup-test-data`
3. Click "Setup Test Data"
4. You should see:
   ```
   ✅ Company admin created: admin@testcompany.com
   ✅ Created: John Doe
   ✅ Created: Jane Smith
   ... and more!
   ```

---

## 🔧 Still Not Working? Check These:

### Problem: "Missing or insufficient permissions"

**Solution**: You also need to set up Firestore rules

1. In Firebase Console, go to **Firestore Database**
2. Click the **Rules** tab
3. See `FIREBASE_SETUP.md` for the complete rules

### Problem: "Email already in use"

**Solution**: Delete existing test users

1. Go to Firebase Console → Authentication → Users
2. Delete all test users (admin@testcompany.com, john.doe@testcompany.com, etc.)
3. Go to Firestore Database and delete documents in all collections
4. Try setup again

### Problem: Can't find "Email/Password" option

**Solution**: Wrong section

- Make sure you're in **Authentication** (not Settings)
- Make sure you're on **Sign-in method** tab (not Users tab)

---

## 📚 Complete Documentation

For more detailed instructions including Firestore rules setup, see:

- `FIREBASE_SETUP.md` - Complete Firebase configuration guide
- `TESTING_GUIDE.md` - Testing instructions after setup
- `PROJECT_STATUS.md` - Full project overview

---

## ✅ Success Checklist

After enabling Email/Password authentication:

- [ ] Firebase Console shows "Email/Password: Enabled"
- [ ] Test data setup completes without errors
- [ ] Firebase Authentication shows 6 users
- [ ] Firebase Firestore shows documents in companies/employees/withdrawals
- [ ] Can login at `/login` with `admin@testcompany.com` / `Test@123`

**Once you see ✅ everywhere, you're ready to test the full app!**
