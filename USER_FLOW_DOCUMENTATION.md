# User Authentication & Onboarding Flow

## Complete User Journey Flow

### 📍 **Entry Points**

1. **Landing Page** (`/`) - Home page with IELTS landing content
2. **Sign In Page** (`/user/signin`) - For existing users
3. **Sign Up Page** (`/user/signup`) - For new users

---

## 🔄 **Flow 1: New User Registration (Sign Up → Onboarding)**

```
┌─────────────────┐
│  Landing Page   │
│       (/)       │
└────────┬────────┘
         │
         │ Click "Sign Up" or Navigate to /user/signup
         ▼
┌─────────────────┐
│   Sign Up Page  │
│ /user/signup    │
└────────┬────────┘
         │
         │ User fills form:
         │ - Email
         │ - Password (min 8 chars)
         │ - Optional: Google/Apple OAuth
         │
         │ Submit → POST /api/users
         ▼
┌─────────────────┐
│  API: /api/users│
│     (POST)      │
└────────┬────────┘
         │
         │ Validates:
         │ - Email uniqueness
         │ - Required fields
         │ - Hashes password (bcrypt)
         │
         │ Creates user with:
         │ - username (from email)
         │ - email
         │ - password (hashed)
         │ - role: "user" (default)
         │ - type: "free" (default)
         │
         │ Returns: { success: true, data: user }
         ▼
┌─────────────────┐
│  Sign Up Page   │
│  (Success)      │
└────────┬────────┘
         │
         │ Shows success toast
         │ Auto-redirects after 2 seconds
         ▼
┌─────────────────┐
│  Sign In Page   │
│ /user/signin    │
└─────────────────┘
```

---

## 🔐 **Flow 2: Existing User Sign In**

```
┌─────────────────┐
│  Sign In Page   │
│ /user/signin    │
└────────┬────────┘
         │
         │ User enters:
         │ - Email
         │ - Password
         │
         │ Submit → signIn("credentials")
         ▼
┌─────────────────┐
│  NextAuth       │
│  Credentials    │
│   Provider      │
└────────┬────────┘
         │
         │ Calls: POST /api/auth/login
         ▼
┌─────────────────┐
│ /api/auth/login │
│     (POST)      │
└────────┬────────┘
         │
         │ Validates:
         │ - Email exists
         │ - Password matches (bcrypt.compare)
         │
         │ Returns: { success: true, data: [user] }
         │ (without password)
         ▼
┌─────────────────┐
│  NextAuth       │
│  JWT Callback   │
└────────┬────────┘
         │
         │ Creates JWT token with:
         │ - user.id
         │ - user.name
         │ - user.email
         │ - user.role
         │
         │ Session created (30-day expiry)
         ▼
┌─────────────────┐
│  Sign In Page   │
│  (Success)      │
└────────┬────────┘
         │
         │ Redirects to:
         │ /user/onboarding?next={callbackUrl}
         │
         │ callbackUrl = original destination or "/"
         ▼
┌─────────────────┐
│  Onboarding     │
│ /user/onboarding│
└────────┬────────┘
```

---

## 🎯 **Flow 3: Onboarding Wizard**

```
┌─────────────────┐
│  Onboarding     │
│ /user/onboarding│
└────────┬────────┘
         │
         │ Checks:
         │ 1. User is authenticated (session)
         │ 2. User onboarding status from DB
         │
         │ If status = "completed" or "skipped"
         │ → Redirect to nextPath (dashboard or callbackUrl)
         │
         │ If status = null or "in-progress"
         │ → Show onboarding wizard
         ▼
┌─────────────────┐
│  Step 1: Goals  │
└────────┬────────┘
         │
         │ Collects:
         │ - Purpose (Study/Work/Immigration/etc)
         │ - Target band score (6.0 - 8.0+)
         │ - Exam date (quick select or custom date)
         │
         │ Click "Continue"
         ▼
┌─────────────────┐
│ Step 2: Profile │
└────────┬────────┘
         │
         │ Collects:
         │ - Current English level
         │ - Hardest IELTS module
         │ - Target countries (multi-select)
         │ - Preferred test format (Academic/General/UKVI)
         │
         │ Click "Continue" or "Back"
         ▼
┌─────────────────┐
│ Step 3: Services│
└────────┬────────┘
         │
         │ Collects:
         │ - Counselling interest (Yes/Maybe/No)
         │ - Interest areas (multi-select):
         │   • Study abroad consultation
         │   • IELTS coaching
         │   • Writing correction
         │   • Speaking partners
         │   • Crash courses
         │   • Scholarship alerts
         │   • Visa guidance
         │ - Communication channels (Email/WhatsApp/SMS)
         │
         │ Click "Continue" or "Back"
         ▼
┌─────────────────┐
│ Step 4: Wrap Up │
└────────┬────────┘
         │
         │ Collects:
         │ - Availability slots (multi-select)
         │ - Share scores checkbox
         │ - Additional notes (textarea)
         │
         │ Click "Finish" or "Back"
         │
         │ OR Click "Skip for now"
         │ → Sets status = "skipped"
         │ → Redirects to nextPath
         ▼
┌─────────────────┐
│  Submit         │
│  Onboarding     │
└────────┬────────┘
         │
         │ PATCH /api/users/[id]
         │
         │ Updates user with:
         │ onboarding: {
         │   ...all form data,
         │   status: "completed",
         │   completedAt: ISO timestamp
         │ }
         │
         │ Saves to localStorage:
         │ "ielts-onboarding-status-{userId}" = "completed"
         ▼
┌─────────────────┐
│  Success        │
│  Redirect       │
└────────┬────────┘
         │
         │ Shows success message
         │ Redirects after 1.5s to:
         │ - nextPath (from query param)
         │ - OR /dashboard (default)
         │
         │ Typical destinations:
         │ - /userDashboard
         │ - / (home)
         │ - Original protected route
         ▼
┌─────────────────┐
│   Dashboard     │
│  or Home Page   │
└─────────────────┘
```

---

## 🔄 **Flow 4: Navigation Between Pages**

### **Sign In ↔ Sign Up Navigation**

```
Sign In Page (/user/signin)
    │
    │ Link: "Don't have an account? Create one now"
    │ → /user/signup
    │
    └─────────────────────────────┐
                                   │
                                   ▼
                            Sign Up Page (/user/signup)
                                   │
                                   │ Link: "Already have an account? Sign in"
                                   │ → /user/signin
                                   │
                                   └─────────────────────────────┐
                                                                 │
                                                                 ▼
                                                          (Circular navigation)
```

### **Forgot Password Flow** (Placeholder)

```
Sign In Page
    │
    │ Link: "Forgot?" → /user/forgot-password
    │
    └─→ Forgot Password Page (Not implemented yet)
```

---

## 🔒 **Authentication Middleware Flow**

```
User tries to access protected route
    │
    │ (e.g., /test/listening/[id])
    │
    ▼
┌─────────────────┐
│  Middleware     │
│  (middleware.ts)│
└────────┬────────┘
         │
         │ Checks:
         │ 1. Is route protected?
         │    - /test/listening/
         │    - /test/reading/
         │    - /test/writing/
         │    - /test/speaking/
         │
         │ 2. Is user authenticated?
         │    - getToken() from NextAuth
         │
         │ 3. If /admin route:
         │    - Check if role === "admin"
         │
         │ If NOT authenticated:
         │ → Redirect to /api/auth/signin
         │
         │ If authenticated but wrong role:
         │ → Redirect to /api/auth/signin
         │
         │ If authenticated:
         │ → Allow access
         ▼
┌─────────────────┐
│  Protected      │
│  Route          │
└─────────────────┘
```

---

## 📋 **Onboarding Status Check Logic**

```typescript
// Onboarding page checks:

1. Session status:
   - "loading" → Show loading spinner
   - "unauthenticated" → Redirect to /user/signin
   - "authenticated" → Continue

2. User onboarding status (from DB):
   - "completed" → Redirect to nextPath
   - "skipped" → Redirect to nextPath
   - null or "in-progress" → Show onboarding wizard

3. LocalStorage check:
   - Checks: "ielts-onboarding-status-{userId}"
   - Used for quick client-side check
   - DB is source of truth
```

---

## 🎨 **UI/UX Features**

### **Sign In Page**
- ✅ Beautiful gradient background (rose theme)
- ✅ Split layout with marketing content
- ✅ Email/password form
- ✅ "Forgot password?" link
- ✅ Social login buttons (Google, Facebook, LinkedIn) - UI only
- ✅ Link to sign up page
- ✅ Error handling with alerts
- ✅ Loading states

### **Sign Up Page**
- ✅ Similar design to sign in
- ✅ Email/password form
- ✅ Social login buttons (Google, Apple) - UI only
- ✅ Password requirements (min 8 chars)
- ✅ Link to sign in page
- ✅ Success toast notification
- ✅ Auto-redirect to sign in after success

### **Onboarding Wizard**
- ✅ 4-step wizard with progress bar
- ✅ Step navigation (Next/Back buttons)
- ✅ "Skip for now" option
- ✅ Beautiful side panel with benefits
- ✅ Form validation
- ✅ LocalStorage + DB persistence
- ✅ Success message before redirect
- ✅ Responsive design

---

## 🔑 **Key API Endpoints**

### **Authentication**
- `POST /api/auth/login` - Validates credentials, returns user data
- `GET/POST /api/auth/[...nextauth]` - NextAuth handler

### **User Management**
- `POST /api/users` - Create new user (sign up)
- `GET /api/users` - Get all users (admin)
- `GET /api/users/[id]` - Get single user
- `PATCH /api/users/[id]` - Update user (onboarding data)

---

## 🔐 **Security Features**

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **JWT Sessions**: 30-day expiry
3. **Route Protection**: Middleware checks authentication
4. **Role-Based Access**: Admin routes require admin role
5. **Email Uniqueness**: Prevents duplicate accounts
6. **Password Exclusion**: Never returned in API responses

---

## 📝 **Data Models**

### **User Model**
```typescript
{
  username: string,
  email: string,
  password: string (hashed),
  image?: string,
  phone?: string,
  location?: string,
  bio?: string,
  role: string ("user" | "admin"),
  type: string ("free" | "premium"),
  onboarding?: {
    purpose: string,
    targetScore: string,
    examDate: string,
    englishLevel: string,
    hardestModule: string,
    targetCountries: string[],
    testType: string,
    counsellingInterest: string,
    interestAreas: string[],
    communication: string[],
    availability: string[],
    shareScores: boolean,
    notes: string,
    status: "completed" | "skipped" | "in-progress",
    completedAt: ISO string
  }
}
```

---

## 🚀 **Complete User Journey Example**

### **New User**
1. Lands on homepage → Clicks "Sign Up"
2. Fills sign up form → Account created
3. Redirected to sign in → Signs in
4. Redirected to onboarding → Completes 4 steps
5. Redirected to dashboard → Can take tests

### **Returning User**
1. Lands on homepage → Clicks "Sign In"
2. Enters credentials → Authenticated
3. Checks onboarding status → Already completed
4. Redirected to dashboard → Can take tests

### **Admin User**
1. Signs in with admin credentials
2. Redirected to onboarding (if not completed)
3. After onboarding → Can access `/admin` routes

---

## 🔄 **State Management**

- **NextAuth Session**: Global session state
- **LocalStorage**: Onboarding status cache
- **React State**: Form data, loading states, errors
- **MongoDB**: Source of truth for user data

---

## ⚠️ **Error Handling**

- **Sign Up**: Shows error if email exists
- **Sign In**: Shows "Invalid Email or Password" for failures
- **Onboarding**: Shows error if save fails, allows retry
- **API Errors**: Graceful error messages to user

---

## 🎯 **Next Steps / Future Enhancements**

1. **Forgot Password**: Implement password reset flow
2. **Email Verification**: Add email confirmation
3. **OAuth Integration**: Complete Google/Apple/Facebook login
4. **Profile Completion**: Allow users to update onboarding later
5. **Onboarding Skip**: Better handling of skipped onboarding
6. **Remember Me**: Option to extend session duration

