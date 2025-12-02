# Firestore Security Rules Setup

## Issue
You're getting "Missing or insufficient permissions" error when creating tests because Firestore security rules don't allow writes to the `tests` collection.

## Solution

I've created a `firestore.rules` file in the project root. You need to deploy it to Firebase.

### Option 1: Deploy via Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Use the existing `firestore.rules` file when prompted

4. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Update Rules in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste it into the rules editor
6. Click **Publish**

## What the Rules Do

The rules allow:
- **Authenticated users**: Can read questions and tests
- **Admins only**: Can create, update, and delete questions and tests
- **Users**: Can read/update their own user document
- **Admins**: Can manage all user documents

## Verify Admin Role

Make sure your user has the `role: "admin"` field in the `users/{userId}` document in Firestore. You can check this in Firebase Console under Firestore Database → `users` collection.






