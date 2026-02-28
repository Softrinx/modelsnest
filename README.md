# Modelsnest — Enterprise AI API Platform

Modelsnest is a production-grade AI API aggregation platform that provides unified access to 50+ AI models (GPT-4, Claude, Llama, DALL-E, Whisper, ElevenLabs, and more) through a single, consistent API interface. The platform is designed for developers and enterprises who need reliable, scalable, cost-transparent AI infrastructure without vendor lock-in.

**Core value proposition:** One API key, every AI model, transparent pay-as-you-go pricing at $0.001/1K tokens, with <200ms latency and 99.99% uptime.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Custom auth with Supabase |
| Payments | PayPal + Coinbase Commerce |
| Package Manager | pnpm |

---

## Project Structure

```
Modelsnest/
├── app/                        # Next.js App Router — all pages and API routes
│   ├── about/                  # About page
│   ├── actions/                # Next.js Server Actions
│   ├── admin/                  # Admin panel (protected, admin role required)
│   ├── api/                    # API route handlers (REST endpoints)
│   ├── api-docs/               # Interactive API documentation page
│   ├── blog/                   # Blog listing and posts
│   ├── careers/                # Careers page
│   ├── community/              # Community page
│   ├── compliance/             # Compliance information page
│   ├── contact/                # Contact page
│   ├── dashboard/              # Authenticated user dashboard
│   ├── docs/                   # Product documentation
│   ├── dpa/                    # Data Processing Agreement page
│   ├── forgot-password/        # Forgot password flow
│   ├── help/                   # Help center
│   ├── legal/                  # Legal hub index
│   ├── login/                  # Login page
│   ├── not-found.tsx           # 404 page
│   ├── error.tsx               # Global error boundary page
│   ├── loading.tsx             # Global loading UI
│   ├── page.tsx                # Landing / home page
│   ├── press/                  # Press page
│   ├── privacy/                # Privacy policy
│   ├── reference/              # API reference docs
│   ├── reset-password/         # Password reset flow
│   ├── robots.ts               # robots.txt generation
│   ├── sdks/                   # SDK documentation and downloads
│   ├── security/               # Security overview page
│   ├── signup/                 # User registration page
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── terms/                  # Terms of service
│   ├── tutorials/              # Tutorial pages
│   ├── layout.tsx              # Root layout (fonts, providers, metadata)
│   └── globals.css             # Global CSS styles (Tailwind base + custom vars)
│
├── components/                 # Reusable React components
│   │
│   ├── ui/                     # Primitive UI components (shadcn/ui based)
│   │   ├── avatar.tsx          # Avatar component
│   │   ├── badge.tsx           # Badge / pill component
│   │   ├── button.tsx          # Button with variants
│   │   ├── card.tsx            # Card, CardHeader, CardContent, etc.
│   │   ├── code-block.tsx      # Syntax-highlighted code block
│   │   ├── dialog.tsx          # Modal dialog
│   │   ├── input.tsx           # Text input
│   │   ├── label.tsx           # Form label
│   │   ├── radio-group.tsx     # Radio button group
│   │   ├── select.tsx          # Dropdown select
│   │   ├── separator.tsx       # Visual divider
│   │   ├── sheet.tsx           # Slide-over / drawer
│   │   ├── table.tsx           # Data table
│   │   ├── tabs.tsx            # Tabbed interface
│   │   └── textarea.tsx        # Multi-line text input
│   │
│   ├── bento/                  # Bento grid feature illustration components
│   │   ├── ai-code-reviews.tsx                     # AI code review bento card
│   │   ├── easy-deployment.tsx                     # Deployment bento card
│   │   ├── mcp-connectivity-illustration.tsx       # MCP server connectivity visual
│   │   ├── one-click-integrations-illustration.tsx # One-click integrations visual
│   │   ├── parallel-agents.tsx                     # Parallel agents bento card
│   │   └── real-time-previews.tsx                  # Real-time preview bento card
│   │
│   ├── AiCodeReviews.module.css        # CSS module for AI code reviews component
│   ├── admin-login-form.tsx            # Admin-specific login form
│   ├── admin-sidebar.tsx               # Sidebar navigation for admin panel
│   ├── admin-user-deduct-dialog.tsx    # Admin dialog to deduct credits from a user
│   ├── admin-user-topup-dialog.tsx     # Admin dialog to add credits to a user
│   ├── animated-icons.tsx              # Animated icon components
│   ├── animated-section.tsx            # Scroll-triggered animated section wrapper
│   ├── api-showcase.tsx                # Landing page API showcase / demo section
│   ├── api-tokens-list.tsx             # List of user API tokens with actions
│   ├── api-tokens-main.tsx             # API tokens page main content
│   ├── bento-section.tsx               # Bento grid section for landing page
│   ├── billing-main.tsx                # Billing page main content
│   ├── billing-overview.tsx            # Billing summary / balance overview widget
│   ├── chat-interface.tsx              # Core chat UI shell
│   ├── chat-main.tsx                   # Chat page main layout
│   ├── chat-message.tsx                # Individual chat message bubble
│   ├── chat-welcome.tsx                # Chat empty state / welcome screen
│   ├── coinbase-button.tsx             # Coinbase Commerce payment button
│   ├── competitive-edge.tsx            # Landing page competitive advantages section
│   ├── create-token-dialog.tsx         # Dialog to create a new API token
│   ├── cta-section.tsx                 # Call-to-action section
│   ├── dashboard-chat-interface.tsx    # Chat interface embedded in dashboard
│   ├── dashboard-content.tsx           # Dashboard content area wrapper
│   ├── dashboard-header.tsx            # Dashboard top header bar
│   ├── dashboard-main.tsx              # Dashboard main view (API Store)
│   ├── dashboard-preview.tsx           # Landing page dashboard preview mockup
│   ├── dashboard-sidebar.tsx           # Dashboard left sidebar navigation
│   ├── dashboard-stats.tsx             # Dashboard stats/metrics widgets
│   ├── developer-experience.tsx        # Landing page developer experience section
│   ├── enterprise-solutions.tsx        # Landing page enterprise section
│   ├── error-boundary.tsx              # React error boundary component
│   ├── faq-section.tsx                 # FAQ accordion section
│   ├── final-cta.tsx                   # Bottom-of-page final CTA section
│   ├── footer-section.tsx              # Footer wrapper section
│   ├── footer.tsx                      # Site footer with links
│   ├── forgot-password-form.tsx        # Forgot password email form
│   ├── global-clients.tsx              # Trusted-by / global clients logo strip
│   ├── header.tsx                      # Site header / navbar
│   ├── hero-section.tsx                # Landing page hero
│   ├── integrations-section.tsx        # Integrations showcase section
│   ├── large-testimonial.tsx           # Featured large testimonial quote
│   ├── legal-breadcrumb.tsx            # Breadcrumb for legal pages
│   ├── loading-message.tsx             # Chat loading / typing indicator
│   ├── login-form.tsx                  # User login form
│   ├── logout-button.tsx               # Sign out button
│   ├── message-input.tsx               # Chat message input bar
│   ├── message-list.tsx                # Scrollable chat message list
│   ├── model-docs-page.tsx             # Individual model documentation page
│   ├── model-selector.tsx              # Dropdown to select AI model in chat
│   ├── models-docs-index.tsx           # Index of all available model docs
│   ├── models-main.tsx                 # Models page main content
│   ├── notifications-main.tsx          # Notifications page main content
│   ├── Modelsnest-logo.tsx                # Modelsnest SVG logo component
│   ├── paypal-button.tsx               # PayPal payment button
│   ├── paypal-config-checker.tsx       # Dev tool: validates PayPal configuration
│   ├── paypal-status-checker.tsx       # Dev tool: checks PayPal connection status
│   ├── print-invoice-button.tsx        # Print/download invoice button
│   ├── pricing-section.tsx             # Landing page pricing section
│   ├── reset-password-form.tsx         # New password form (after reset link)
│   ├── security-main.tsx               # Security page main content
│   ├── settings-main.tsx               # User settings page main content
│   ├── signup-form.tsx                 # User registration form
│   ├── social-proof.tsx                # Social proof / stats section
│   ├── streaming-message.tsx           # Streaming AI response component
│   ├── structured-data.tsx             # JSON-LD structured data for SEO
│   ├── testimonial-grid-section.tsx    # Grid of testimonial cards
│   ├── testimonials.tsx                # Testimonials carousel / list
│   ├── theme-provider.tsx              # next-themes provider wrapper
│   ├── token-action-dialog.tsx         # Dialog for token actions (revoke, copy)
│   ├── top-up-dialog.tsx               # Add credits dialog (payment selection)
│   ├── transaction-history.tsx         # Table of past transactions
│   ├── usage-analytics.tsx             # Usage charts and analytics dashboard
│   ├── user-id-section.tsx             # Displays user ID with copy button
│   └── vision-section.tsx              # Landing page vision / mission section
│
├── contexts/
│   └── sidebar-context.tsx     # React context for sidebar open/close state
│
├── hooks/
│   └── use-chat-stream.ts      # Custom hook for streaming AI chat responses (SSE)
│
├── lib/
│   ├── api-utils.ts            # Shared API helper functions (error handling, response formatting)
│   ├── auth.ts                 # Authentication helpers (session, JWT, middleware utils)
│   ├── chat-api.ts             # Client-side functions for calling chat/completion endpoints
│   ├── coinbase.ts             # Coinbase Commerce SDK integration
│   ├── db.ts                   # Supabase client initialization and DB query helpers
│   ├── get-app-url.ts          # Utility to get the correct app base URL (dev vs prod)
│   ├── paypal.ts               # PayPal SDK integration (current)
│   ├── paypal-legacy.ts        # PayPal legacy integration (kept for reference)
│   └── utils.ts                # General utility functions (cn, formatting, etc.)
│
├── scripts/
│   ├── 001_create_auth_tables.sql          # Migration: users, sessions tables
│   ├── 002_create_api_tokens_table.sql     # Migration: api_tokens table
│   ├── 003_create_password_reset_table.sql # Migration: password_reset_tokens table
│   ├── 004_create_billing_tables.sql       # Migration: transactions, balances tables
│   ├── 005_add_role_column.sql             # Migration: add role column to users
│   ├── fix_api_tokens_table.sql            # Hotfix migration for api_tokens schema
│   ├── create-admin-user.js                # Script to seed an initial admin user
│   ├── run-migrations.js                   # Script to run all SQL migrations in order
│   ├── test-paypal-auth.js                 # Test PayPal OAuth2 token flow
│   ├── test-paypal-auth-legacy.js          # Test legacy PayPal auth flow
│   ├── test-paypal-config.js               # Validate PayPal environment config
│   └── README.md                           # Scripts usage documentation
│
├── styles/
│   └── globals.css             # (Legacy location — global styles now live at app/globals.css)
│
├── types/                      # Shared TypeScript type definitions
│
├── public/                     # Static assets (images, icons, fonts)
│
├── middleware.ts               # Next.js middleware — auth guards, route protection
├── components.json             # shadcn/ui component configuration
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS configuration
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # pnpm lockfile
├── env.example                 # Example environment variables
├── debug-db.js                 # Development script to debug database connection
├── REPAIR_DB.bat               # Windows script to repair/reset local DB state
├── API_FEATURES.md             # Documentation of implemented API features
├── PAYPAL_IMPLEMENTATION.md    # PayPal integration implementation notes
└── SEO_IMPROVEMENTS.md         # SEO work log and recommendations
```

---

## Database Schema (Supabase / PostgreSQL)

Migrations are in `scripts/` and run in numbered order:

| Migration | Table(s) Created | Purpose |
|---|---|---|
| `001` | `users`, `sessions` | Core auth — user accounts and login sessions |
| `002` | `api_tokens` | User-generated API keys with scopes and expiry |
| `003` | `password_reset_tokens` | Time-limited tokens for password reset emails |
| `004` | `credit_transactions`, `user_credits`, `usage_logs` | Billing ledger — top-ups, usage charges, balance tracking |
| `005` | *(alter users)* | Adds `role` column for admin vs user access control |
| `006` | *(idempotent fix/align)* | Ensures all non-user app tables/columns/indexes are present and UUID-compatible |

---

## Authentication & Authorization

- Custom session-based auth built on Supabase
- Password hashing handled server-side
- `middleware.ts` protects dashboard, admin, and API routes
- Role-based access: `user` (default) and `admin`
- Password reset via email token flow (`forgot-password` → email → `reset-password`)

---

## Payments

Two payment providers are integrated:

**PayPal** (`lib/paypal.ts`)
- Standard PayPal Checkout for credit top-ups
- Order creation and capture via PayPal REST API
- Legacy integration preserved in `lib/paypal-legacy.ts`

**Coinbase Commerce** (`lib/coinbase.ts`)
- Crypto payment option for credit top-ups
- Webhook-based payment confirmation

Both providers write to the `transactions` table and update the user's `balances` record on successful payment.

---

## Key Features

- **API Store** — Browsable marketplace of 6,000+ pre-built APIs (web scraping, automation, data extraction) surfaced in the dashboard
- **Chat Interface** — Real-time streaming AI chat with model selection, powered by SSE via `use-chat-stream.ts`
- **API Token Management** — Users can create, revoke, and manage multiple API keys with usage tracking
- **Usage Analytics** — Charts and metrics showing token consumption, request counts, and cost over time
- **Billing Dashboard** — Balance display, transaction history, invoices, and top-up flow
- **Admin Panel** — User management with ability to add or deduct credits manually
- **50+ Model Support** — Text (GPT-4, Claude, Llama), Image (DALL-E, SD), Audio (Whisper), Embeddings, Multimodal

---

## Environment Variables

Copy `env.example` to `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=

# Coinbase Commerce
COINBASE_COMMERCE_API_KEY=
COINBASE_COMMERCE_WEBHOOK_SECRET=

# Auth
AUTH_SECRET=
```

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp env.example .env.local

# Run database migrations (requires Supabase project)
node scripts/run-migrations.js

# Create initial admin user
node scripts/create-admin-user.js

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## AI Models tables

The model catalog is stored in PostgreSQL and powers:
- model cards in the dashboard
- category filters
- docs index + model-specific docs pages
- billing logic by model/unit

Each model is represented as one row in `ai_models`, then related rows in the companion tables add features, pricing, and documentation details.

### Core catalog tables

| Table | Purpose | Key columns |
|---|---|---|
| `ai_model_categories` | Model category metadata used in UI filters and tags | `slug`, `name`, `short_name`, `display_order`, `color`, `icon_name` |
| `ai_models` | Primary model registry | `slug`, `name`, `provider`, `category_slug`, `status`, `is_active`, `performance`, `has_documentation`, `sort_order` |
| `ai_model_features` | Feature bullets per model and page context | `model_id`, `source` (`models_page`, `docs_index`, `docs_page`), `feature_text`, `sort_order` |
| `ai_model_pricing` | Billing config per model | `model_id`, `input_price`, `output_price`, `price_unit`, `currency` |

- `ai_model_categories`: one row per category (text, image, audio, video, etc.), including display metadata for UI.
- `ai_models`: one row per model slug (for example `deepseek`, `midjourney-v5`) and activation state.
- `ai_model_features`: multiple rows per model for feature bullets shown in different UI surfaces.
- `ai_model_pricing`: one or more rows per model for billing rates and units (`1k tokens`, `second`, `image`, etc.).

### Docs tables

| Table | Purpose | Key columns |
|---|---|---|
| `ai_model_docs` | Top-level docs entry for each model | `model_id`, `docs_description`, `endpoint_method`, `endpoint_path`, `endpoint_status`, `response_example` |
| `ai_model_doc_steps` | Quick-start steps shown on docs pages | `model_id`, `step_order`, `step_text` |
| `ai_model_doc_parameters` | Parameter reference rows | `model_id`, `param_name`, `param_type`, `is_required`, `default_value`, `description` |
| `ai_model_doc_examples` | Language-specific code examples | `model_id`, `language`, `code_example`, `sort_order` |

- `ai_model_docs`: one canonical API-doc summary per model.
- `ai_model_doc_steps`: ordered quick-start steps rendered in docs UI.
- `ai_model_doc_parameters`: typed request parameter metadata for docs tables.
- `ai_model_doc_examples`: code snippets per language/runtime.

### Notes on seeding and consistency

- Schema setup: `scripts/009_create_model_catalog_tables.sql`
- Seed data: `scripts/seed-model-catalog.sql`
- API routes use these tables for model activation checks and billing unit/rate lookup.
- Keep `ai_model_docs.endpoint_path` and `docs_index_payload.quick_start` aligned with implemented routes under `app/api/v1/**`.


## API Usage

This project exposes an OpenAI‑style API surface on top of Novita, secured with **user API tokens** and billed against **user credits**.

### Endpoint map

| Capability | Endpoint | Billing unit(s) |
|---|---|---|
| Chat completions | `POST /api/v1/chat/completions` | token-based (`1k tokens` variants) |
| Audio transcription | `POST /api/v1/audio/transcriptions` | `minute` or `second` |
| Text-to-speech | `POST /api/v1/text-to-speech` | `character` or `1k chars` variants |
| Video generation | `POST /api/v1/video/generations` | `second` |
| Image generation | `POST /api/v1/images/generate` | `image` |

### Authentication

- **Header**: `Authorization: Bearer ptr_...`
- Tokens are created and managed in the **Dashboard → API** page.
- All endpoints will:
  - Verify the token (`ptr_...`) against the `api_tokens` table.
  - Resolve the owning user and apply billing against that user’s `user_credits` balance.
  - Return **402** (`INSUFFICIENT_CREDITS`) if the user has insufficient credits.

### Base URL

In development, the base URL is:

```text
http://localhost:3000/api
```

In production, replace with your deployed domain (for example `https://modelsnest.com/api`).

---

### Chat completions (LLMs)

- **Endpoint**: `POST /api/v1/chat/completions`
- **Headers**:
  - `Authorization: Bearer ptr_YOUR_API_TOKEN`
  - `Content-Type: application/json`

**Request body (OpenAI‑compatible)**

```json
{
  "model": "deepseek",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Explain the history of computers." }
  ],
  "max_tokens": 512,
  "temperature": 0.7
}
```

- `model` must match a slug in the `ai_models` catalog.
- The route:
  - Ensures the model is **active** in `ai_models`.
  - Loads per‑model pricing from `ai_model_pricing` where price unit is token-based (`1k tokens` variants), `currency = 'USD'`.
  - Computes cost from `usage.total_tokens` and deducts credits via `credit_transactions` + triggers.

**Response (truncated)**

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "model": "deepseek/deepseek-v3-0324",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "..." },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 64,
    "total_tokens": 76
  },
  "billing": {
    "cost_usd": 0.0001,
    "price_per_1k_tokens_usd": 0.0004,
    "catalog_pricing": {
      "slug": "deepseek",
      "input_price": 0.000269,
      "output_price": 0.0004,
      "price_unit": "1k tokens"
    }
  }
}
```

If the **billing transaction insert fails**, the API returns **500** and does **not** return a successful completion, ensuring there are no “free” responses.

---

### Audio transcriptions (voice)

- **Endpoint**: `POST /api/v1/audio/transcriptions`
- **Headers**:
  - `Authorization: Bearer ptr_YOUR_API_TOKEN`
  - `Content-Type: multipart/form-data`

**Form fields**

- `model`: catalog slug for the transcription model (for example `whisper-1`).
- `duration_seconds`: total audio duration in seconds (used for billing).

**Billing logic**

- Uses `ai_model_pricing` where `price_unit` is either `minute` or `second`, `currency = 'USD'`.
- Calculates:
  - if unit is `minute`: `cost = (duration_seconds / 60) * unitPrice`
  - if unit is `second`: `cost = duration_seconds * unitPrice`
- Inserts a `usage` transaction and `usage_logs` entry; returns **402** if credits are too low.

_Note: currently this endpoint validates and bills the request and returns JSON with `billing` info. It is the integration point to plug in Novita’s audio API._

---

### Text‑to‑speech (TTS)

- **Endpoint**: `POST /api/v1/text-to-speech`
- **Headers**:
  - `Authorization: Bearer ptr_YOUR_API_TOKEN`
  - `Content-Type: application/json`

**Request body**

```json
{
  "model": "elevenlabs-v3",
  "text": "Welcome to Modelsnest. Your AI infrastructure, supercharged."
}
```

- You may optionally pass an explicit `characters` field to override `text.length` for billing.

**Billing logic**

- Uses `ai_model_pricing` where `price_unit` is either `character` or `1k chars` variants, `currency = 'USD'`.
- Calculates:
  - if unit is `character`: `cost = characters_billed * unitPrice`
  - if unit is `1k chars`: `cost = (characters_billed / 1000) * unitPrice`
- Records a `usage` transaction and `usage_logs` row, then returns a JSON acknowledgment including `cost_usd`.

_Note: this endpoint currently stubs the provider call; it is the place to integrate Novita’s TTS._

---

### Video generations

- **Endpoint**: `POST /api/v1/video/generations`
- **Headers**:
  - `Authorization: Bearer ptr_YOUR_API_TOKEN`
  - `Content-Type: application/json`

**Request body**

```json
{
  "model": "runway-gen-3",
  "duration_seconds": 10
}
```

**Billing logic**

- Uses `ai_model_pricing` where `price_unit = 'second'`, `currency = 'USD'`.
- Calculates: `cost = duration_seconds * perSecondPrice`.
- Validates credits, records a `usage` transaction and `usage_logs` entry, and returns JSON with `cost_usd`.

_Note: this endpoint is a billing + validation shell for video generation; plug in the provider call here._

---

### Image generations

- **Endpoint**: `POST /api/v1/images/generate`
- **Headers**:
  - `Authorization: Bearer ptr_YOUR_API_TOKEN`
  - `Content-Type: application/json`

**Request body**

```json
{
  "model": "midjourney-v5",
  "prompt": "A cinematic sunset over mountains",
  "num_images": 1,
  "width": 1024,
  "height": 1024
}
```

- `model` and `prompt` are required.
- `num_images` (or `n`) is optional, defaults to `1`, and is validated to `1..10`.

**Billing logic**

- Uses `ai_model_pricing` where `price_unit = 'image'`, `currency = 'USD'`.
- Calculates: `cost = image_count * perImagePrice`.
- Validates credits, records `credit_transactions` + `usage_logs`, and returns JSON with `billing.cost_usd`.

_Note: this endpoint currently validates and bills, and returns an accepted response shell for provider integration._

---

### Error codes

Common error patterns across all endpoints:

- `401 MISSING_AUTH_HEADER` / `INVALID_TOKEN` — no `Authorization` header or invalid `ptr_` token.
- `400 MISSING_MODEL` / `MODEL_UNAVAILABLE` / `MODEL_NOT_FOUND` — model slug is missing, inactive, or not present in `ai_models`.
- `402 INSUFFICIENT_CREDITS` — user’s `user_credits.balance` is insufficient for the computed cost.
- `500 PRICING_MISSING` / `INVALID_PRICING` / `USAGE_TRANSACTION_FAILED` / `INTERNAL_ERROR` — configuration or billing errors; no credits are deducted in these cases.

## Notes

- `app/globals.css` is the canonical global stylesheet. The file at `styles/globals.css` is a legacy artifact and is no longer the active stylesheet.
- The `scripts/` directory contains both SQL migrations and standalone Node.js utility/test scripts. Migrations should be run in numbered order.
- PayPal test scripts (`test-paypal-*.js`) are developer utilities and are not part of the application runtime.