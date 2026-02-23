# N8N Clone

A workflow automation platform inspired by n8n. This project enables users to create, manage, and execute complex automation workflows with a visual interface.

## 📚 Development Progress

### Chapter 1: Project Setup ✅
- [x] Initialize Next.js 15.5.4 with Turbopack
- [x] Set up TypeScript configuration
- [x] Configure Biome for linting and formatting
- [x] Install and configure Tailwind CSS v4
- [x] Set up Shadcn UI component library
- [x] Project structure organization

### Chapter 2: Database and ORM ✅
- [x] Set up Prisma ORM (v6.16.3)
- [x] Configure PostgreSQL database (Neon)
- [x] Create database schema (User & Post models)
- [x] Explore Prisma Studio
- [x] Test Prisma API integration
- [x] Database migrations and seeding

### Chapter 3: tRPC Setup ✅
- [x] Set up tRPC v11
- [x] Create procedures with Prisma API
- [x] Explore tRPC server-side (prefetch, context)
- [x] Explore tRPC client-side (hooks, provider)
- [x] Explore server + client with prefetch (hydration)
- [x] Production-ready configuration

### Chapter 4: Authentication ✅
- [x] Set up BetterAuth v1.3.26
- [x] Add login/register UI
- [x] Add auth utilities
- [x] Protect procedures with sessions

### Chapter 5: Theme & Styling ✅
- [x] Apply new theme
- [x] Improve auth screens
- [x] Add logos

### Chapter 6: Background Jobs ✓
- [x] Setup Inngest
- [x] Create a background job
- [x] Add mprocs for parallel dev
- [x] Branch and PR created
- [x] Review & merge

#### Background Job Example
- Inngest function created in `src/inngest/functions.ts`
- Runs in parallel with Next.js using `mprocs`
- See `package.json` for dev script

#### GitHub Workflow
- Branch created for background jobs
- PR submitted for review
- Merge after approval

## Project Structure

```
N8NCLONE/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Server-side prefetch demo
│   │   ├── client.tsx         # Client component
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── globals.css        # Global styles
│   │   └── api/
│   │       └── trpc/          # tRPC API route handler
│   ├── components/            # React components
│   │   └── ui/               # Shadcn UI components
│   ├── lib/                   # Utility functions and clients
│   │   ├── db.ts            # Prisma client
│   │   ├── auth.ts          # Auth helpers
│   │   └── password.ts      # Password utilities
│   ├── trpc/                  # tRPC setup
│   │   ├── init.ts           # tRPC initialization
│   │   ├── server.tsx        # Server-only proxy
│   │   ├── client.tsx        # Client provider
│   │   ├── query-client.ts   # React Query config
│   │   └── routers/
│   │       └── _app.ts       # API procedures
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
└── package.json
```

## Tech Stack

### Full Stack (Monorepo)
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

1. **Clone the repository**
```bash
git clone <repository-url>
cd N8NCLONE
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
DATABASE_URL="postgresql://user:password@host:5432/database"
```

4. **Set up database**
```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# (Optional) Open Prisma Studio
npx prisma studio
```

### Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

### User Model
```prisma
model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @default(now()) @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}
```

### Session Model
```prisma
model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@map("session")
}
```

### Account Model
```prisma
model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@map("account")
}
```

### Verification Model
```prisma
model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now()) @updatedAt

  @@map("verification")
}
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## 📊 Visual Documentation

Comprehensive visual guides and sequence diagrams for understanding the architecture:

- **[Sequence Diagrams](SEQUENCE_DIAGRAMS.md)** - Complete request/response flows for all chapters
  - Chapter 2: User creation, authentication, and Prisma data flows
  - Chapter 3: Server-side prefetching, client-side queries, and tRPC context
  - Timing diagrams and performance metrics

- **[Architecture Reference Guide](ARCHITECTURE_REFERENCE.md)** - Visual architecture and component relationships
  - Layer diagrams showing data flow through the application
  - Database schema visualizations with relationships
  - Type safety flow from Prisma → tRPC → Client
  - Server-side rendering flow with hydration
  - Performance characteristics and metrics

- **[Chapter 2 Technical Summary](CHAPTER_2_SUMMARY.md)** - Database & ORM deep-dive (1000+ lines)
  - Prisma setup and configuration
  - Password hashing with bcrypt security patterns
  - Database migration strategies
  - Authentication and authorization flows

- **[Chapter 3 Technical Summary](CHAPTER_3_SUMMARY.md)** - tRPC Setup deep-dive (1000+ lines)
  - tRPC architecture with full-stack type safety
  - Server procedure implementation
  - Client-side prefetching and query patterns
  - Advanced patterns (caching, batching, context)

- **[Chapter 4 Technical Summary](CHAPTER_4_SUMMARY.md)** - Authentication deep-dive
  - BetterAuth setup with Prisma adapter
  - Auth UI flows (login/register)
  - Session validation and protected procedure flow

- **[Chapter 5 Technical Summary](CHAPTER_5_SUMMARY.md)** - Theme & styling deep-dive
  - Visual theme tokens and global styles
  - Auth screen styling upgrades
  - Logo placement and branding

- **[Chapter 6 Technical Summary](CHAPTER_6_SUMMARY.md)** - Background Jobs
  - Inngest setup and configuration
  - Background job creation and execution
  - Parallel development with mprocs
  - Branch and PR creation
  - Review and merge

## 🔄 Key Architecture Diagrams

### Chapter 2 - User Creation Flow (Database & ORM)

```mermaid
sequenceDiagram
    participant Client as Client/Frontend
    participant API as API Route
    participant AuthLib as Auth Library
    participant Prisma as Prisma Client
    participant DB as PostgreSQL<br/>(Neon)
    
    Client->>API: POST /api/... (username, email, password)
    API->>AuthLib: createUser(data)
    AuthLib->>AuthLib: hashPassword(password)
    AuthLib->>Prisma: prisma.user.create()
    Prisma->>DB: INSERT INTO "User" (email, username, password)
    DB-->>Prisma: User { id, email, created_at }
    Prisma-->>AuthLib: User object (password excluded)
    AuthLib-->>API: { success: true, user }
    API-->>Client: 200 OK { user }
```

**Flow Explanation:**
1. Client submits form with credentials
2. Password hashed with bcrypt (10 salt rounds)
3. Prisma creates user in PostgreSQL
4. Password hash stored (never returned to client)
5. User data returned without sensitive fields

---

### Chapter 2 - Authentication Flow (Password Verification)

```mermaid
sequenceDiagram
    participant Client as Client/Frontend
    participant API as API Route
    participant AuthLib as Auth Library<br/>(verifyPassword)
    participant Prisma as Prisma Client
    participant DB as PostgreSQL<br/>(Neon)
    participant JWT as JWT/Session
    
    Client->>API: POST /api/login (email, password)
    API->>AuthLib: authenticateUser(email, password)
    AuthLib->>Prisma: prisma.user.findUnique()
    Prisma->>DB: SELECT * FROM "User" WHERE email = ?
    DB-->>Prisma: User { password_hash, ... }
    Prisma-->>AuthLib: User object
    AuthLib->>AuthLib: verifyPassword(inputPassword, hash)
    alt Password Matches
        AuthLib-->>API: User { id, email, username }
        API->>JWT: createSession(userId)
        JWT-->>API: token/cookie
        API-->>Client: 200 OK { user, token }
    else Password Invalid
        AuthLib-->>API: null or error
        API-->>Client: 401 Unauthorized
    end
```

**Security Features:**
- Timing-safe password comparison (bcrypt.compare)
- Email indexed for fast lookups
- Password never leaked on failed auth
- Session/JWT created only on success

---

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

## Architecture Comparison

| Aspect | Chapter 2 | Chapter 3 | Chapter 4 | Chapter 5 |
|--------|-----------|----------|-----------|-----------|
| **Type Safety** | Partial (Prisma → API) | End-to-end (DB → Client) | End-to-end (Auth + API) | UI only |
| **API Definition** | Manual routes | tRPC routers | BetterAuth + tRPC | N/A |
| **Client Queries** | fetch() + types | useQuery hooks | authClient + hooks | N/A |
| **Data Format** | JSON | superjson (Dates, BigInt) | Session tokens | N/A |
| **Caching** | Manual | React Query built-in | Session-based | N/A |
| **Server Data** | Separate calls | Prefetch + hydrate | Session validation | N/A |
| **Context Sharing** | Per-route | Middleware + cache | protectedProcedure | N/A |

For detailed explanations of these flows, see [SEQUENCE_DIAGRAMS.md](SEQUENCE_DIAGRAMS.md) and [ARCHITECTURE_REFERENCE.md](ARCHITECTURE_REFERENCE.md).

## Prisma Commands

- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema to database
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma migrate reset` - Reset database

## Project Features

- Visual workflow builder (Coming soon)
- Node-based automation (Coming soon)
- Workflow execution and monitoring (Coming soon)
- Database integration with Prisma ✅
- Type-safe API layer ✅

## Development Workflow

1. Create a new branch for each chapter/feature
2. Make changes and test locally
3. Create a Pull Request
4. Review and merge to main

## Contributing

Guidelines for contributing to this project.

## License

Specify your project license.

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
**Current Chapter**: Chapter 7 - AI Providers ✓
