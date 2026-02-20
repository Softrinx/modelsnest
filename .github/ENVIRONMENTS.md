# GitHub Environments and Secrets

This repository uses GitHub Environments to scope secrets by stage:

- `staging`: used by `.github/workflows/ci.yml` (`deploy_staging` job)
- `production`: used by `.github/workflows/production-deploy.yml`

## 1) Create environments

In GitHub:

1. Go to `Settings` -> `Environments`
2. Create `staging`
3. Create `production`

Recommended protections:

- `staging`: optional reviewers
- `production`: required reviewers + deployment branch rules (`main`)

## 2) Repository-level secrets (shared by CI/build)

Add these in `Settings` -> `Secrets and variables` -> `Actions`:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `NEXTAUTH_SECRET`
- `NOVITA_API_KEY`
- `PAYPAL_TEST`
- `PAYPAL_CLIENT_ID_SANDBOX`
- `PAYPAL_CLIENT_SECRET_SANDBOX`
- `PAYPAL_CLIENT_ID_LIVE`
- `PAYPAL_CLIENT_SECRET_LIVE`
- `PAYPAL_WEBHOOK_ID_SANDBOX`
- `PAYPAL_WEBHOOK_ID_LIVE`
- `COINBASE_COMMERCE_API_KEY`
- `COINBASE_COMMERCE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `APP_URL`

## 3) Environment secrets

Add these per environment:

- `staging`:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
- `production`:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

## 4) Environment variables (non-secret URLs)

Set optional environment variables in each environment:

- `STAGING_APP_URL` (staging environment variable)
- `PRODUCTION_APP_URL` (production environment variable)

These are used to display deployment URLs in workflow runs.

## 5) Deployment model used by workflows

- Staging deploy:
  - Automatic on push to `main` after frontend/backend CI jobs pass.
  - Runs `vercel pull/build/deploy` in `preview` mode.
- Production deploy:
  - Manual (`workflow_dispatch`).
  - Requires explicit confirmation value: `deploy-production`.
  - Runs `vercel pull/build/deploy` with `--prod`.
