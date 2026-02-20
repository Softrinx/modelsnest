# Admin User Credentials

## Admin Panel Access

**Login URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Credentials:**
- Email: `admin@outsoor.com`
- Password: `admin123!@#`

> ⚠️ **IMPORTANT:** Change this password after first login!

## Login Flow

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Upon successful login, you'll be redirected to `/admin` (admin dashboard)
4. If you try to access `/admin` without being logged in, you'll be automatically redirected to `/admin/login`

## How Admin Access Works

The app uses **email-based admin detection**. Any user with an email in the `ADMIN_EMAILS` array is automatically granted admin privileges.

**Admin emails are configured in:**
- `middleware.ts` - Line 7
- `lib/auth.ts` - Line 5
- `app/admin/layout.tsx` - Line 7
- `app/actions/admin-auth.ts` - Line 7
- `components/admin-login-form.tsx` - Line 13

## Adding More Admin Users

### Option 1: Via Script (Recommended)
```bash
# Edit scripts/create-admin-user.js and change the email/password
node scripts/create-admin-user.js
```

### Option 2: Via Supabase Dashboard
1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Invite User" or "Add User"
3. Create user with desired email
4. Add the email to the `ADMIN_EMAILS` array in all locations mentioned above

### Option 3: Via Signup Flow
1. User signs up normally at `/signup`
2. Add their email to the `ADMIN_EMAILS` array
3. User will have admin access on next login

## Security Notes

- Admin emails are hardcoded in the application
- No database table is used for admin role management
- Service role key is required for programmatic user creation
- Keep `SUPABASE_SERVICE_ROLE_KEY` secure and never expose it to the client

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Only for create-admin-user.js
```
