# How to Deploy Firestore Rules - Step by Step

## The Problem
You're getting "Missing or insufficient permissions" because Firestore security rules haven't been updated to allow creating tests.

## Solution: Deploy the Rules

### Method 1: Firebase Console (Easiest - No CLI needed)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your project: `testseries-53dbe`

2. **Navigate to Firestore Rules**
   - In the left sidebar, click **"Firestore Database"**
   - Click the **"Rules"** tab at the top

3. **Copy and Paste the Rules**
   - Open the file `firestore.rules` in your project
   - Copy ALL the contents (Ctrl+A, Ctrl+C)
   - Paste into the Firebase Console Rules editor
   - Click **"Publish"** button

4. **Wait for Deployment**
   - You'll see a success message when rules are published
   - Rules take effect immediately

### Method 2: Firebase CLI (If you have it installed)

```bash
# Navigate to your project
cd acadts

# Deploy rules
firebase deploy --only firestore:rules
```

## Verify Your Admin Role

Before the rules will work, make sure your user has admin role:

1. In Firebase Console → Firestore Database
2. Click on **"users"** collection
3. Find your user document with ID: `IWDgto7oiOPjLOHvkkRPH7Pi9or2`
4. Check if it has a field: `role` with value `"admin"`
5. If missing, click "Add field":
   - Field name: `role`
   - Type: `string`
   - Value: `admin`
   - Click "Update"

## Test After Deployment

1. Try creating a test again
2. If it still fails, check:
   - Rules were published successfully
   - Your user document has `role: "admin"`
   - You're logged in with the correct account

## Troubleshooting

If rules still don't work after deployment:

1. **Check Rules Syntax**: In Firebase Console → Rules tab, make sure there are no red error indicators
2. **Verify Admin Role**: Double-check your user document has `role: "admin"`
3. **Check Browser Console**: Look for any additional error messages
4. **Try Logging Out/In**: Sometimes auth tokens need to refresh

## Current Rules Summary

The rules allow:
- ✅ **Authenticated users**: Can read questions and tests
- ✅ **Admins only**: Can create, update, delete questions and tests
- ✅ **Users**: Can manage their own user document
- ✅ **Admins**: Can manage all user documents



