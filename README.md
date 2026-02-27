# N8N Clone

A workflow automation platform inspired by n8n. Create, manage, and execute complex automation workflows with a visual interface.

## Tech Stack
- **Framework**: Next.js 15.5.4
- **Language**: TypeScript 5
- **Runtime**: Node.js
- **Build Tool**: Turbopack
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6.19.2
- **API Layer**: tRPC v11
- **Query Caching**: TanStack React Query
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Validation**: Zod
- **Security**: bcrypt for password hashing
- **Linting/Formatting**: Biome 2.2.0

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation
1. Clone the repository:
  ```bash
  git clone <repository-url>
  cd N8NCLONE
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Set up environment variables:
  ```bash
  # Create .env file
  DATABASE_URL="postgresql://user:password@host:5432/database"
  ```
4. Set up database:
  ```bash
  npx prisma db push
  npx prisma generate
  npx prisma studio # optional
  ```

### Running the Application
```bash
npm run dev         # Development mode
npm run build       # Build for production
npm start           # Start production server
```
App available at [http://localhost:3000](http://localhost:3000)
```


## 🛠️ Tech Stack
- **Framework**: Next.js 15.5.4
- **Language**: TypeScript 5
- **Runtime**: Node.js
- **Build Tool**: Turbopack
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6.19.2
- **API Layer**: tRPC v11
- **Query Caching**: TanStack React Query
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Validation**: Zod
- **Security**: bcrypt for password hashing
- **Linting/Formatting**: Biome 2.2.0

---



## ⚡ Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation
1. Clone the repository:
  ```bash
  git clone <repository-url>
  cd N8NCLONE
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Set up environment variables:
  ```bash
  # Create .env file
  DATABASE_URL="postgresql://user:password@host:5432/database"
  ```
4. Set up database:
  ```bash
  npx prisma db push
  npx prisma generate
  npx prisma studio # optional
  ```

### Running the Application
```bash
npm run dev         # Development mode
npm run build       # Build for production
npm start           # Start production server
```
App available at [http://localhost:3000](http://localhost:3000)

---



## 🗄️ Database Schema

See `prisma/schema.prisma` for full details.

---



## 📜 Available Scripts
- `npm run dev` — Start development server with Turbopack
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run Biome linter
- `npm run format` — Format code with Biome

---



# ...existing code...

### Chapter 3 - Server-Side Prefetching Flow

```mermaid
sequenceDiagram
    participant Browser as Browser/Client
    participant Server as Next.js Server<br/>(page.tsx)
    participant QueryClient as React Query<br/>QueryClient
    participant tRPC as tRPC Router
    participant Prisma as Prisma Client
    participant DB as PostgreSQL<br/>(Neon)
    
    Browser->>Server: GET /
    Server->>QueryClient: create new instance
    Server->>tRPC: queryClient.prefetchQuery(getUsers)
    tRPC->>Prisma: prisma.user.findMany()
    Prisma->>DB: SELECT * FROM "User"
    DB-->>Prisma: User[]
    Prisma-->>tRPC: [ { id, email, username }, ... ]
    tRPC-->>QueryClient: store in cache
    Server->>Server: dehydrate(queryClient)
    Server->>Server: HydrationBoundary { state }
    Server-->>Browser: HTML + dehydrated state
    Browser->>Browser: Hydrate QueryClient
    Browser->>Browser: useQuery hook reads cache
    Browser-->>Browser: Render with data (no loading)
```

**Performance Benefits:**
- Data fetched on server (faster database access)
- HTML includes data (LCP improvement)
- Browser hydrates from cache (zero loading state)
- No waterfalls (browser won't re-fetch)

---

### Chapter 3 - Client-Side Query Flow

```mermaid
sequenceDiagram
    participant Component as React Component<br/>(client.tsx)
    participant Hook as useQuery Hook
    participant Client as tRPC Client
    participant HTTPLink as HTTP Link<br/>(Batch)
    participant APIRoute as API Route<br/>([trpc]/route.ts)
    participant Router as tRPC Router
    participant Prisma as Prisma Client
    participant DB as PostgreSQL
    
    Component->>Hook: useQuery(trpc.getUsers)
    Hook->>Client: Execute query
    Client->>HTTPLink: POST /api/trpc/getUsers
    HTTPLink->>APIRoute: Request with context
    APIRoute->>Router: Call procedure handler
    Router->>Prisma: prisma.user.findMany()
    Prisma->>DB: SELECT * FROM "User"
    DB-->>Prisma: User[]
    Prisma-->>Router: Results
    Router-->>APIRoute: Response
    APIRoute-->>HTTPLink: 200 OK { result: [...] }
    HTTPLink-->>Client: Deserialize response
    Client-->>Hook: Update cache + state
    Hook-->>Component: Trigger re-render
    Component->>Component: Render with data
```

**Key Features:**
- Type-safe queries from TypeScript types
- Automatic request batching
- React Query handles caching
- superjson serialization for complex types
- Automatic loading/error states

---

### Chapter 3 - tRPC Context & Middleware (Per-Request Caching)

```mermaid
sequenceDiagram
    participant Request as HTTP Request
    participant Middleware as tRPC Middleware<br/>(context)
    participant SessionCache as React cache()<br/>(Per-request)
    participant Procedure as tRPC Procedure
    participant Prisma as Prisma Client
    participant DB as PostgreSQL
    
    Request->>Middleware: API call
    Middleware->>Middleware: Extract headers/cookies
    Middleware->>SessionCache: Verify session (cached)
    SessionCache->>DB: First request: Check auth
    DB-->>SessionCache: User session data
    SessionCache-->>Middleware: Return cached session
    Middleware->>Procedure: Call with context
    Procedure->>Procedure: Type-safe input validation
    Procedure->>Prisma: Execute query/mutation
    Prisma->>DB: Database operation
    DB-->>Prisma: Result
    Prisma-->>Procedure: Typed response
    Procedure-->>Request: JSON response (serialized by superjson)
```

**Context Benefits:**
- Context created once per request
- React `cache()` deduplicates identical calls
- Session verified once, used everywhere
- Type-safe within procedures
- Prisma context available to all handlers

---

### Chapter 4 - Authentication Flows (BetterAuth)

```mermaid
sequenceDiagram
  participant User as User/Browser
  participant Register as Register Form
  participant Client as Auth Client
  participant API as /api/auth
  participant Auth as BetterAuth
  participant DB as PostgreSQL

  User->>Register: Submit email + password
  Register->>Client: authClient.signUp.email()
  Client->>API: POST /api/auth/*
  API->>Auth: Validate + create account
  Auth->>DB: Insert user + account
  DB-->>Auth: User created
  Auth-->>API: Success response
  API-->>Client: Return session/user
  Client-->>Register: Redirect or success UI
```

**Sign Up Flow:**
- Client form calls `authClient.signUp.email`
- BetterAuth creates the user in the database
- Session is created and returned

---

```mermaid
sequenceDiagram
  participant User as User/Browser
  participant Login as Login Form
  participant Client as Auth Client
  participant API as /api/auth
  participant Auth as BetterAuth
  participant DB as PostgreSQL

  User->>Login: Submit email + password
  Login->>Client: authClient.signIn.email()
  Client->>API: POST /api/auth/*
  API->>Auth: Validate credentials
  Auth->>DB: Find user + verify password
  alt Valid credentials
    DB-->>Auth: User found
    Auth-->>API: Success response
    API-->>Client: Session token
    Client-->>Login: Redirect or success UI
  else Invalid credentials
    DB-->>Auth: Not found or mismatch
    Auth-->>API: Error response
    API-->>Client: Show error message
  end
```

**Sign In Flow:**
- BetterAuth validates credentials
- Returns a session on success

---

```mermaid
sequenceDiagram
  participant Request as Request
  participant tRPC as tRPC Router
  participant Protected as protectedProcedure
  participant Auth as BetterAuth
  participant DB as PostgreSQL

  Request->>tRPC: Call protected procedure
  tRPC->>Protected: Execute middleware
  Protected->>Auth: auth.api.getSession(headers)
  Auth->>DB: Validate session token
  alt Session valid
    DB-->>Auth: Session + user
    Auth-->>Protected: Session
    Protected-->>tRPC: Continue with ctx.auth
    tRPC-->>Request: Procedure response
  else Session missing
    DB-->>Auth: No session
    Auth-->>Protected: null
    Protected-->>tRPC: UNAUTHORIZED error
    tRPC-->>Request: Error response
  end
```

**Protected Procedure Flow:**
- `protectedProcedure` checks session via BetterAuth
- Request is rejected if not authenticated

---

```mermaid
sequenceDiagram
  participant User as User/Browser
  participant Login as /login page
  participant Register as /register page
  participant Client as Auth Client

  User->>Login: Open /login
  Login-->>User: Show login form
  User->>Register: Click "Sign Up"
  Register-->>User: Show register form
  User->>Register: Submit registration
  Register->>Client: signUp.email()
  Client-->>Register: Success
  Register-->>User: Redirect to app
```

**Auth UI Navigation:**
- Login page links to register
- Register flow redirects on success

---

```mermaid
sequenceDiagram
  participant Client as Auth Client
  participant API as /api/auth/session
  participant Auth as BetterAuth
  participant DB as PostgreSQL

  Client->>API: GET session
  API->>Auth: Validate token
  Auth->>DB: Fetch session + user
  DB-->>Auth: Session data
  Auth-->>API: Session response
  API-->>Client: { session, user }
```

**Session Validation:**
- Used by client to check login state

---

### Chapter 5 - Theme & Styling Summary

**What changed:**
- New global theme and typography tokens
- Auth screens refreshed for layout, spacing, and visual hierarchy
- Logos added to reinforce branding

---

### Chapter 6 - Background Jobs

- Inngest setup and configuration
- Background job creation and execution
- Parallel development with mprocs
- Branch and PR creation
- Review and merge


## 🏗️ Architecture Comparison

| Aspect | Ch. 2 | Ch. 3 | Ch. 4 | Ch. 5 |
|--------|-------|-------|-------|-------|
| Type Safety | Partial | End-to-end | End-to-end | UI only |
| API Definition | Manual | tRPC routers | BetterAuth + tRPC | N/A |
| Client Queries | fetch() | useQuery | authClient | N/A |
| Data Format | JSON | superjson | Session tokens | N/A |
| Caching | Manual | React Query | Session-based | N/A |
| Server Data | Separate | Prefetch | Session validation | N/A |
| Context Sharing | Per-route | Middleware | protectedProcedure | N/A |

---



## 🧩 Prisma Commands
- `npx prisma studio` — Open Prisma Studio
- `npx prisma generate` — Generate Prisma Client
- `npx prisma db push` — Push schema to database
- `npx prisma migrate dev` — Create and apply migrations
- `npx prisma migrate reset` — Reset database

---



## 🧑‍💻 Development Workflow
1. Create a new branch for each chapter/feature
2. Make changes and test locally
3. Create a Pull Request
4. Review and merge to main

---



## 🤝 Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License
Specify your project license here.

---




### Chapter 7: AI Providers ✅
- [x] Choose AI model(s): Gemini, OpenAI, Anthropic, etc.
- [x] Set up AI SDK(s) and environment variables
- [x] Integrate AI SDK with Inngest background jobs
- [x] Add provider selection logic
- [x] Test AI workflow end-to-end
- [x] Branch and PR created
- [x] Review & merge

#### AI Provider Integration Example
- Users can select from multiple AI providers (Gemini, OpenAI, Anthropic)
- SDKs are initialized based on provider selection
- Inngest background jobs use the selected AI model to process tasks
- Provider and API key are managed via environment variables

#### Sequence Diagram: AI Provider Workflow
```mermaid
sequenceDiagram
    participant User as User/Frontend
    participant API as API Route
    participant Inngest as Inngest Function
    participant Provider as AI Provider SDK
    participant Model as AI Model (Gemini/OpenAI/Anthropic)

    User->>API: Submit workflow with provider/model choice
    API->>Inngest: Trigger background job (provider, input)
    Inngest->>Provider: Initialize SDK (env vars)
    Provider->>Model: Send prompt/input
    Model-->>Provider: AI response
    Provider-->>Inngest: Return result
    Inngest-->>API: Job complete (result)
    API-->>User: Show AI output
```

---

**Last Updated**: February 23, 2026  

### Chapter 8: Error Tracking ✅
- [x] Setup Sentry for error tracking
- [x] Demonstrate session replays
- [x] Demonstrate logs
- [x] Demonstrate AI monitoring
- [x] Branch and PR created
- [x] Review & merge

#### Error Tracking Integration Example
- Sentry is integrated for real-time error monitoring
- Session replays capture user interactions for debugging
- Logs and traces are sent to Sentry for analysis
- AI monitoring tracks model errors and latency

#### Sequence Diagram: Error Tracking Workflow
```mermaid
sequenceDiagram
  participant User as User/Frontend
  participant App as App/Next.js
  participant Sentry as Sentry SDK
  participant Dashboard as Sentry Dashboard

  User->>App: Interacts with app (triggers error)
  App->>Sentry: Capture error/log/session replay
  Sentry-->>Dashboard: Send error data
  Dashboard-->>App: Error insights, alerts
```

---

**Last Updated**: February 23, 2026  
**Current Chapter**: Chapter 8 - Error Tracking ✓

**Last Updated**: February 24, 2026  
**Current Chapter**: Chapter 9 - Sidebar Layout ✓


### Chapter 9: Sidebar Layout ✅
- [x] Improve file structure
- [x] Create placeholder routes
- [x] Create sidebar layout
- [x] Update README and documentation
- [x] Branch and PR created
- [x] Review & merge

#### Sidebar Layout Example
- Sidebar layout provides consistent navigation
- Placeholder routes allow for future expansion

#### Sequence Diagram: Sidebar Layout
```mermaid
sequenceDiagram
  participant User
  participant App
  participant Sidebar
  participant Router

  User->>App: Accesses dashboard
  App->>Router: Loads dashboard route
  Router->>Sidebar: Renders sidebar layout
  Sidebar-->>App: Sidebar displayed
  App-->>User: Shows dashboard with sidebar
  User->>Sidebar: Navigates to placeholder route
  Sidebar->>Router: Triggers route change
  Router->>App: Loads new placeholder route
  App-->>User: Shows placeholder content
```

---

### Chapter 10: Payments 🚧
- [ ] Integrate payment provider (Stripe, PayPal, etc.)
- [ ] Add payment UI and checkout flow
- [ ] Store payment and subscription data in database
- [ ] Secure payment endpoints and webhooks
- [ ] Test payment flows end-to-end

#### Payments Example
- Payment integration for subscriptions and workflow automation
- Secure checkout and webhook handling

#### Sequence Diagram: Payment Workflow
```mermaid
sequenceDiagram
  participant User as User/Frontend
  participant App as App/Next.js
  participant PaymentUI as Payment UI
  participant API as Payment API
  participant Provider as Payment Provider (Stripe/PayPal)
  participant DB as Database

  User->>App: Initiates payment/subscription
  App->>PaymentUI: Show checkout form
  PaymentUI->>API: Submit payment details
  API->>Provider: Process payment
  Provider-->>API: Payment confirmation
  API->>DB: Store payment/subscription
  API-->>PaymentUI: Success/failure response
  PaymentUI-->>User: Show result/redirect
```

---

**Last Updated**: February 24, 2026  
**Current Chapter**: Chapter 10 - Payments 🚧
