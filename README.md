# พลประกาย แอร์ เซอร์วิส

Next.js website with TanStack Query 5, Prisma ORM 7, Supabase Postgres, and Supabase Storage.

## Setup

```bash
npm install
npm run dev
```

`npm install` also updates `package-lock.json` after dependency changes. Run it before `npm ci` or deployment. The site runs at http://localhost:3000.

## Environment

Set the following values in the ignored `.env.local` file:

- `NEXT_PUBLIC_SITE_URL`: public website URL.
- `ADMIN_USERNAME`: single administrator login name (defaults to `admin` in the local template).
- `ADMIN_PASSWORD`: strong administrator password. Login remains unavailable while this is empty; restart the server after changing it.
- `DATABASE_URL`: Supabase transaction pooler connection string (port `6543`, with `pgbouncer=true`) for application queries.
- `DIRECT_URL`: Supabase direct connection string, or the session pooler URL (port `5432`) if your environment cannot reach the direct IPv6 host. Prisma CLI uses this for migrations.
- `SUPABASE_URL`: project URL from Supabase Dashboard > Connect.
- `SUPABASE_SECRET_KEY`: server-only `sb_secret_...` key from Settings > API Keys.
- `SUPABASE_STORAGE_BUCKET`: name of an existing bucket in Supabase Storage.

Copy the database hosts and usernames from the Supabase Connect dialog; they differ between direct and pooler modes. URL-encode special characters in the database password. Keep the secret key and database URLs server-side; do not prefix them with `NEXT_PUBLIC_`.

Brand and air model images can be uploaded from the admin forms to the configured Supabase Storage bucket, or entered as image URLs. Create that bucket and make it public so its image URLs can be viewed without credentials. Existing images in `public/` are local assets and are not automatically moved to Storage.

The admin login is at `/admin/login`. A successful login opens `/admin` and sets an HTTP-only cookie valid for eight hours. Use the sign-out button to clear it.

## Prisma

The schema is at `prisma/schema.prisma`. The initial SQL migration is in `prisma/migrations/20261001000000_init/`. After checking that the target Supabase database does not already contain these tables and setting both database URLs, run:

```bash
npx prisma validate
npx prisma migrate deploy
npx prisma generate
```

The Prisma 7 configuration loads `DIRECT_URL` from `.env.local` for CLI commands. Do not run migrations until it points to the intended Supabase database.

Client-side API calls use TanStack Query. The admin area lists and manages air models at `/admin`, brands at `/admin/brands`, and air systems at `/admin/systems`. System names are entered as free text.
Air model warranty values are stored and entered in days. The admin list displays 365 days as one year and preserves any remaining days.
