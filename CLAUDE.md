- Remindly - Project Summary & Current Status

## Project Overview

**Remindly** is an AI-powered payment reminder system that helps small businesses get paid faster without damaging client relationships. The core value proposition is: "Get paid 40% faster with AI-personalized reminders."

### Problem We're Solving
- SMBs waste 5-10 hours/week chasing late payments
- Generic reminder templates get ignored (low response rates)
- Business owners fear seeming "pushy" so they delay sending reminders
- Late payments kill cash flow (64% of SMBs cite this as their biggest challenge)

### Solution
AI that writes personalized payment reminder emails based on invoice context, customer history, and relationship dynamics. Automated, intelligent, and relationship-safe.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16.0.3 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **UI Components:** Custom components (no component library)

### Backend
- **Runtime:** Next.js API Routes + Server Actions
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Magic Link)
- **File Storage:** Supabase Storage (future)

### External Services
- **AI:** OpenAI GPT-4o (for reminder generation and PDF extraction)
- **Payments:** Stripe (payment links)
- **Email:** Resend (planned for Day 5)

### Infrastructure
- **Hosting:** Vercel
- **Environment:** Node.js serverless functions

---

## Current Architecture

### Database Schema

```sql
-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies NOT NULL,
  invoice_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'unpaid', -- unpaid, paid, overdue
  stripe_payment_link TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders table (tracks sent reminders)
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  tone TEXT, -- friendly, neutral, firm
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

All tables have RLS enabled with the following policies:
- Users can only view their own data
- Users can insert data for their own company
- Users can update their own data
- Users cannot delete data (soft deletes planned)

---

## Project Structure

```
remindly-mvp/
├── app/
│   ├── actions/
│   │   ├── auth.ts              # Sign out action
│   │   ├── invoices.ts          # Create invoice action
│   │   └── extractInvoice.ts    # PDF extraction (COMPLETED Day 3)
│   ├── api/
│   │   └── (future endpoints for webhooks, cron jobs)
│   ├── dashboard/
│   │   ├── page.tsx             # Main dashboard (Server Component)
│   │   ├── invoices/
│   │   │   └── new/
│   │   │       └── page.tsx     # New invoice form (Client Component)
│   │   └── settings/
│   │       └── page.tsx         # (TODO: Day 10)
│   ├── login/
│   │   └── page.tsx             # Login page (Client Component)
│   └── layout.tsx               # Root layout
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Client-side Supabase client
│   │   ├── server.ts            # Server-side Supabase client
│   │   └── middleware.ts        # Auth middleware
│   └── (future utilities)
├── middleware.ts                # Next.js middleware for auth
├── database.types.ts            # Generated Supabase types
└── .env.local                   # Environment variables
```

---

## Completed Features (Days 1-3)

### ✅ Day 1-2: Authentication & Dashboard

**Authentication:**
- Magic link email authentication (Supabase Auth)
- Protected routes via middleware
- Session management (cookies)
- Sign out functionality

**Dashboard:**
- Server Component with real-time data from Supabase
- Stats cards: Outstanding amount, Overdue amount, Reminders sent
- Invoice list table with status badges
- Empty states for new users
- Responsive design (desktop + mobile)

**Key Files:**
- `app/login/page.tsx` - Magic link login UI
- `app/dashboard/page.tsx` - Main dashboard
- `middleware.ts` - Auth code exchange and route protection
- `lib/supabase/middleware.ts` - Session refresh logic

---

### ✅ Day 2: Invoice Management

**Invoice Creation:**
- Manual invoice entry form (Client Component)
- Fields: invoice number, customer name/email, amount, issue/due dates
- Server Action for database insert
- Auto-generates invoice number (INV-XXXXXX format)
- Redirects to dashboard after creation

**Invoice Display:**
- Dashboard shows all user's invoices
- Columns: Invoice #, Customer (name + email), Amount, Due Date, Status
- Status calculation: Paid, Overdue (past due + unpaid), Unpaid
- Click-to-sort functionality (planned)

**Key Files:**
- `app/dashboard/invoices/new/page.tsx` - Invoice creation form
- `app/actions/invoices.ts` - Create invoice Server Action

---

### ✅ Day 3: PDF Invoice Upload & AI Extraction

**PDF Upload:**
- Toggle between "Upload PDF" and "Enter Manually" modes
- File input accepts `.pdf` files
- Visual upload UI with drag-and-drop area

**AI Extraction (COMPLETED):**
- Uses `unpdf` library to extract text from PDF
- Sends extracted text to OpenAI GPT-4o
- Structured JSON response using `response_format: { type: "json_object" }`
- Extracts: invoice_number, customer_name, customer_email, amount, issue_date, due_date
- Pre-fills manual entry form with extracted data
- Handles extraction errors gracefully (fallback to manual entry)

**Implementation Details:**
```typescript
// File: app/actions/extractInvoice.ts
export async function extractInvoiceFromPDF(formData: FormData) {
  // 1. Get PDF file from form
  // 2. Convert to Uint8Array
  // 3. Extract text using unpdf library
  // 4. Send text to OpenAI with structured JSON prompt
  // 5. Parse and return invoice data
  // 6. Handle errors (return success: false)
}
```

**Key Files:**
- `app/actions/extractInvoice.ts` - PDF extraction logic
- `app/dashboard/invoices/new/page.tsx` - Upload UI + form pre-fill

**Libraries Added:**
- `unpdf` - PDF text extraction (works in serverless)
- `openai` - AI extraction

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe (TODO: Add on Day 6)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Email (TODO: Add on Day 5)
# RESEND_API_KEY=re_...
```

---

## Key Design Decisions

### 1. Server Components by Default
- Dashboard is a Server Component (faster initial load, SEO-friendly)
- Only use Client Components when needed (interactivity, state)
- Invoice creation form is Client Component (toggle buttons, file upload)

### 2. Server Actions for Mutations
- All database writes use Server Actions (not API routes)
- Keeps code colocated with UI
- Built-in security (only callable from same origin)

### 3. No Component Library
- Custom Tailwind components for full control
- Faster load times (no heavy dependencies)
- Easier to customize

### 4. Supabase RLS for Security
- All data access controlled by Row Level Security policies
- No direct database queries from client
- User isolation at database level

### 5. AI-First Approach
- Use AI for extraction (PDFs → structured data)
- Use AI for generation (invoice data → personalized emails)
- Keep humans in the loop (preview before sending)

---

## Current User Flow

### 1. Sign Up / Login
```
User visits /login
→ Enters email
→ Clicks "Send Magic Link"
→ Checks email
→ Clicks link
→ Middleware exchanges code for session
→ Redirected to /dashboard
```

### 2. Create Invoice (Manual)
```
Dashboard → Click "+ New Invoice"
→ Toggle to "Enter Manually"
→ Fill form (customer, amount, dates)
→ Click "Create Invoice"
→ Server Action inserts to database
→ Redirect to dashboard
→ See new invoice in table
```

### 3. Create Invoice (PDF Upload)
```
Dashboard → Click "+ New Invoice"
→ Toggle to "Upload PDF"
→ Select PDF file
→ Click "Extract Invoice Data"
→ AI extracts text + parses with OpenAI
→ Form pre-fills with extracted data
→ User reviews/edits
→ Click "Create Invoice"
→ Redirect to dashboard
```

---

## Known Issues & Technical Debt

### Current Bugs
- None critical (Days 1-3 are stable)

### Technical Debt
1. **No error boundaries** - Need to add React error boundaries
2. **No loading skeletons** - Forms show instant renders (add skeleton states)
3. **No pagination** - Invoice list will break with 100+ invoices
4. **No search/filter** - Can't find invoices easily
5. **No mobile optimization** - Works but not perfect on mobile
6. **Invoice number collisions** - Random UUID slice could theoretically collide

### Security Considerations
1. **File size limits** - Need to cap PDF upload size (currently unlimited)
2. **Rate limiting** - No rate limits on AI extraction (could be abused)
3. **Email validation** - Client-side only (need server-side validation)

---

## Next Steps: Day 4 - AI Reminder Generation

### Goal
Generate personalized reminder emails using AI based on invoice data.

### Tasks
1. **Create Invoice Detail Page**
   - Route: `/dashboard/invoices/[id]`
   - Display invoice information
   - Show "Send Reminder" button

2. **Build Reminder Preview Component**
   - Tone selector: Friendly / Neutral / Firm
   - "Generate" button triggers AI
   - Preview subject + body
   - Edit before sending (optional)

3. **Create AI Generation Server Action**
   - File: `app/actions/generateReminder.ts`
   - Input: invoice data + tone
   - Output: subject line + email body
   - Use GPT-4o with structured prompt

4. **Save Reminder to Database**
   - Insert into `reminders` table
   - Link to invoice via `invoice_id`
   - Store tone, subject, body

### AI Prompt Structure (Day 4)

```typescript
const systemPrompt = `You are a professional payment reminder assistant. Generate a ${tone} payment reminder email.

Rules:
- Subject line must be under 60 characters
- Email body should be 3-4 short paragraphs
- Tone: ${tone} (friendly/neutral/firm)
- Include invoice details clearly
- End with clear call-to-action
- Professional but human

Return ONLY valid JSON:
{
  "subject": "string",
  "body": "string"
}`;

const userPrompt = `Invoice details:
- Invoice #: ${invoice_number}
- Customer: ${customer_name}
- Amount: ${amount}
- Due date: ${due_date}
- Days overdue: ${daysOverdue}

Generate a ${tone} reminder email.`;
```

### Expected Output (Day 4 End State)

**User can:**
1. Click on an invoice from dashboard
2. See invoice details page
3. Select tone (Friendly/Neutral/Firm)
4. Click "Generate Reminder"
5. See AI-generated subject + body
6. (Optional) Edit the generated text
7. Preview looks good
8. Reminder is saved to database (not sent yet - that's Day 5)

**New Files Created:**
- `app/dashboard/invoices/[id]/page.tsx` - Invoice detail page
- `app/actions/generateReminder.ts` - AI generation logic
- `app/dashboard/invoices/[id]/components/ReminderPreview.tsx` (optional)

---

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer `const` over `let`
- Use async/await (not .then())
- Server Actions marked with `'use server'`
- Client Components marked with `'use client'`

### Naming Conventions
- Files: kebab-case (e.g., `invoice-list.tsx`)
- Components: PascalCase (e.g., `InvoiceList`)
- Functions: camelCase (e.g., `createInvoice`)
- Database tables: snake_case (e.g., `invoice_items`)

### Error Handling
- Always return `{ success: boolean, error?: string, data?: any }`
- Log errors with `console.error()`
- Show user-friendly error messages
- Never expose stack traces to users

### Testing Approach
- Manual testing for MVP (no automated tests yet)
- Test every feature in both desktop and mobile
- Test with real data (not just Lorem Ipsum)
- Test edge cases (empty states, long text, missing data)

---

## Dependencies

### Current package.json
```json
{
  "dependencies": {
    "next": "16.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "openai": "^4.x",
    "unpdf": "^0.x",
    "stripe": "^17.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/node": "^22.x",
    "@types/react": "^19.x",
    "eslint": "^9.x"
  }
}
```

---

## Performance Metrics (Current)

### Build
- Build time: ~30 seconds
- Bundle size: ~400KB (gzipped)
- Lighthouse score: 90+ (desktop)

### Runtime
- Dashboard load: ~1.5 seconds (cold start)
- Invoice creation: ~500ms
- PDF extraction: ~3-5 seconds (depends on PDF size)

### Costs (Estimated)
- Supabase: Free tier (unlimited up to 500MB DB)
- Vercel: Free tier (100GB bandwidth)
- OpenAI: ~$0.01 per PDF extraction
- Total: ~$0 for first 1,000 users

---

## Git Workflow

### Branching Strategy
- `main` - Production (auto-deploys to Vercel)
- `dev` - Development (testing)
- Feature branches as needed

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Example: `feat: add PDF extraction with OpenAI`

---

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- OpenAI: https://platform.openai.com/docs
- Stripe: https://stripe.com/docs

### Troubleshooting
- If Supabase queries fail → check RLS policies
- If middleware redirects fail → check session exchange
- If PDF extraction fails → check file size and format
- If AI extraction returns bad data → improve prompt specificity

---

## Success Criteria for MVP

### Technical
- [ ] All core features work (auth, invoices, reminders, payments)
- [ ] No critical bugs
- [ ] Mobile responsive
- [ ] <3 second page loads
- [ ] Handles errors gracefully

### User Experience
- [ ] Onboarding takes <5 minutes
- [ ] Can create first invoice in <2 minutes
- [ ] AI extraction works 80%+ of the time
- [ ] Reminders feel personal (not robotic)
- [ ] Payment flow is smooth

### Business
- [ ] 50+ beta signups
- [ ] 10+ active users (created invoice)
- [ ] 5+ reminders sent successfully
- [ ] 1+ payment completed
- [ ] Positive feedback from users

---

## Contact & Questions

**Project Owner:** [Your Name]
**Development Start:** November 2025
**Target Launch:** 3 weeks from start (21 days)
**Current Status:** Day 3 complete, starting Day 4

---

## Quick Start for New Developers

### Setup
```bash
# Clone repo
git clone [repo-url]
cd remindly-mvp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run database migrations (if any)
# (Currently using Supabase dashboard)

# Start dev server
bun run dev

# Open http://localhost:3000
```

### First Tasks
1. Create account via /login
2. Create test invoice manually
3. Upload test PDF invoice
4. Verify extraction works
5. Check dashboard displays correctly

---

**End of Project Summary**

This document should be updated as features are completed. Last updated: Day 3 completion.