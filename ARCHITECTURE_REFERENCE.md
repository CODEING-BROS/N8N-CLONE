# Architecture & Visual Reference Guide

Complete visual architecture diagrams and references for all chapters of the N8N Clone project.

---

## Quick Navigation

- [Chapter 2: Database & ORM Architecture](#chapter-2-database--orm-architecture)
- [Chapter 3: tRPC Architecture](#chapter-3-trpc-architecture)
- [Complete Data Flow](#complete-data-flow)
- [Component Relationships](#component-relationships)

---

## Chapter 2: Database & ORM Architecture

### Layer Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│              (React Components, Next.js Pages)               │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      │ HTTP/Form Submission
                      │
┌─────────────────────▼────────────────────────────────────────┐
│                    API LAYER                                 │
│         (src/app/api/... route handlers)                     │
│                                                              │
│  • Extract request data                                      │
│  • Call auth library                                         │
│  • Handle responses                                          │
└─────────────────────┬────────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                        │
│         (src/lib/auth.ts, src/lib/password.ts)              │
│                                                              │
│  • Password hashing/verification                             │
│  • User creation logic                                       │
│  • Authentication checks                                     │
│  • Data transformation                                       │
└─────────────────────┬────────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────────┐
│                    DATA ACCESS LAYER                         │
│                   (Prisma Client)                            │
│                                                              │
│  src/lib/db.ts                                               │
│  • PrismaClient singleton                                    │
│  • Connection pooling via Neon                               │
│  • Query building & execution                               │
│  • Type-safe models (generated)                              │
└─────────────────────┬────────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│           (PostgreSQL on Neon Cloud)                         │
│                                                              │
│  Tables:                                                     │
│  • User (id, email, username, password, createdAt)           │
│  • Post (id, title, content, userId, createdAt)              │
│  • Indexes on email (unique)                                 │
│  • Constraints (FK on userId)                                │
└──────────────────────────────────────────────────────────────┘
```

### Data Models Diagram

```
┌─────────────────────────────────────────────┐
│              USER MODEL                     │
├─────────────────────────────────────────────┤
│ id          : Int (PK, auto-increment)      │
│ email       : String (unique, indexed)      │
│ username    : String (required)             │
│ password    : String (bcrypt hash)          │
│ createdAt   : DateTime (auto timestamp)     │
│                                             │
│ Relations:                                  │
│ └─→ posts: Post[]  (1:M)                    │
└─────────────────────────────────────────────┘
           │
           │ One User has many Posts
           │
           ▼
┌─────────────────────────────────────────────┐
│              POST MODEL                     │
├─────────────────────────────────────────────┤
│ id        : Int (PK, auto-increment)        │
│ title     : String (required)               │
│ content   : String (required)               │
│ userId    : Int (FK → User)                 │
│ createdAt : DateTime (auto timestamp)       │
│                                             │
│ Relations:                                  │
│ └→ user: User  (M:1)                        │
└─────────────────────────────────────────────┘
```

### Query Flow for User Creation

```
API Handler (POST /api/users)
          │
          ├─ Extract: { username, email, password }
          │
          ▼
Password Hashing Layer
          │
          ├─ Generate salt (rounds: 10)
          ├─ Hash password
          │
          ▼
createUser() Function
          │
          ├─ Validate email not exists
          │
          ▼
prisma.user.create({
  data: {
    email: "user@example.com",
    username: "john_doe",
    password: "$2b$10$..." // bcrypt hash
  }
})
          │
          ├─ [SQL] INSERT INTO "User" (email, username, password, created_at) VALUES (...)
          │
          ▼
PostgreSQL executes
          │
          ├─ Unique constraint check on email
          ├─ Generate timestamp
          ├─ Auto-increment ID
          │
          ▼
Return created User object
  {
    id: 1,
    email: "user@example.com",
    username: "john_doe",
    password: "$2b$10$..." // NEVER SENT TO CLIENT
  }
          │
          ├─ Remove password field (from selectCreate)
          │
          ▼
Return to API Handler
  {
    id: 1,
    email: "user@example.com",
    username: "john_doe"
  }
          │
          ├─ Send 201 Created response
          │
          ▼
Client receives user data (no password)
```

### Password Security Flow

```
User enters password: "MySecurePassword123"
                │
                ▼
bcrypt.hash(password, 10 rounds)
  Round 1: [internal hash calculation]
  Round 2: [hash the result]
  Round 3: [hash again]
  ...
  Round 10: [final secure hash]
                │
                ▼
Result: $2b$10$flQ8iIGlPu3Qhb5DXpXI9eQQQQQQQ...
  Format breakdown:
  $2b$     → bcrypt algorithm version
  10$      → cost parameter (rounds)
  flQ8...  → 53 character hash
                │
                ▼
Store in database
  ✓ Hashes are deterministic for same input+salt combo
  ✓ But salt is included in hash, so each hash unique
  ✓ Impossible to reverse (one-way function)
```

### Login Authentication Flow

```
User submits: { email: "user@example.com", password: "MySecurePassword123" }
                │
                ▼
API: GET user by email from database
                │
                ├─ [SQL] SELECT * FROM "User" WHERE email = ?
                │
                ▼
Retrieved from DB:
  {
    id: 1,
    email: "user@example.com",
    username: "john_doe",
    password: "$2b$10$flQ8iIGlPu3Qhb5DXpXI9e..."
  }
                │
                ▼
bcrypt.compare(userInput, storedHash)
                │
                ├─ Hash the input with stored salt
                ├─ Compare byte-by-byte (timing-safe)
                │
                ▼
┌─────────────────────────────────────────┐
│ Match? ──→ YES                          │
└────────────────┬───────────────────────┘
                 │
                 ▼
            Create session/token
                 │
                 ├─ Sign JWT or set session cookie
                 │
                 ▼
        Return 200 OK + token/cookie
        (password field NEVER returned)
```

---

## Chapter 3: tRPC Architecture

### Full Stack Type Safety

```
┌──────────────────────────────────────────────────────────────┐
│                  PRISMA SCHEMA                               │
│             (Database source of truth)                       │
│                                                              │
│  model User {                                                │
│    id    Int     @id @default(autoincrement())               │
│    email String  @unique                                     │
│    ...                                                       │
│  }                                                           │
└────────┬─────────────────────────────────────┬──────────────┘
         │                                      │
         │ prisma generate                      │
         │                                      │
         ▼                                      ▼
┌──────────────────────┐          ┌──────────────────────────┐
│  TypeScript Types    │          │   Prisma Client Types    │
│  (from Prisma)       │          │                          │
│                      │          │  Type User = {           │
│  type User = {       │          │    id: number            │
│    id: number        │          │    email: string         │
│    email: string     │          │    ...                   │
│    ...               │          │  }                       │
│  }                   │          └──────────────────────────┘
└────────┬─────────────┘
         │
         │ Used in tRPC routers
         │
         ▼
┌──────────────────────────────────────────────┐
│         tRPC ROUTER (src/trpc)               │
│                                              │
│  const router = t.router({                  │
│    getUsers: t.procedure                    │
│      .query(async () => {                   │
│        return prisma.user.findMany();       │
│      })                                     │
│  })                                         │
│                                             │
│  Output type auto-inferred:                 │
│  Promise<User[]>                            │
└──────────┬───────────────────────┬──────────┘
           │                       │
           │ Zod validation        │ TypeScript inference
           │                       │
           ▼                       ▼
┌──────────────────────────────────────────────┐
│         SERVER-SIDE TYPES                    │
│                                              │
│  const returnType: User[] = /* inferred */   │
│                                              │
│  Zod parses output:                          │
│  z.array(userSchema)                         │
└──────────┬────────────────────────────────────┘
           │
           │ serialization (superjson)
           │
           ▼
┌──────────────────────────────────────────────┐
│         JSON SERIALIZATION                   │
│                                              │
│  {                                           │
│    "0": {                                    │
│      "result": {                             │
│        "data": [                             │
│          { "id": 1, "email": "..." }         │
│        ]                                     │
│      }                                       │
│    }                                         │
│  }                                           │
└──────────┬────────────────────────────────────┘
           │
           │ HTTP transport
           │
           ▼
┌──────────────────────────────────────────────┐
│         CLIENT-SIDE TYPES                    │
│                                              │
│  import type { AppRouter } from '@backend'   │
│                                              │
│  const returnType: User[] = /* from server */│
│                                              │
│  No separate schema needed!                  │
│  Client knows exact types from server        │
└──────────┬────────────────────────────────────┘
           │
           │ deserialization (superjson)
           │
           ▼
┌──────────────────────────────────────────────┐
│         REACT COMPONENT                      │
│                                              │
│  const { data } = trpc.getUsers.useQuery()   │
│                                              │
│  // TypeScript knows:                        │
│  // typeof data === User[] | undefined       │
│                                              │
│  {data?.map(user => (                        │
│    <div key={user.id}>{user.email}</div>     │
│  ))}                                         │
└──────────────────────────────────────────────┘
```

### tRPC Server Architecture

```
HTTP Request (POST /api/trpc/[trpc])
    │
    ▼
┌──────────────────────────────────────┐
│   tRPC Request Handler               │
│   (route.ts HTTP adapter)            │
│                                      │
│  • Parse URL for procedure name      │
│  • Extract request body              │
│  • Get context (auth, user, db)      │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   Context Creation (Middleware)      │
│   (init.ts)                          │
│                                      │
│  • Extract headers & cookies         │
│  • Verify JWT/session                │
│  • Load user from database           │
│  • Cache result per request          │
│                                      │
│  Caching with React cache():         │
│  ┌────────────────────────────────┐  │
│  │ First call: DB lookup          │  │
│  │ Subsequent calls: return cache │  │
│  └────────────────────────────────┘  │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   Router Resolution                  │
│   (routers/_app.ts)                  │
│                                      │
│  • Match procedure path              │
│  • Load handler function             │
│  • Prepare validation schema         │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   Input Validation (Zod)             │
│                                      │
│  • Parse JSON input                  │
│  • Validate against schema           │
│  • Return type-safe object or error  │
└────────────┬───────────────────────┘
             │
             ├─ Invalid → Return 400 + error
             │
             ├─ Valid → Continue
             │
             ▼
┌──────────────────────────────────────┐
│   Procedure Handler                  │
│   (custom logic)                     │
│                                      │
│  baseProcedure.query(async (opts) => {
│    const { input, ctx } = opts       │
│                                      │
│    // ctx is fully typed:            │
│    // - session                      │
│    // - user                         │
│    // - prisma                       │
│                                      │
│    // input is validated & typed     │
│                                      │
│    return prisma.user.findMany()     │
│  })                                  │
│                                      │
│  Output type auto-inferred           │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   Response Serialization             │
│   (superjson)                        │
│                                      │
│  • Convert Date → ISO string         │
│  • Handle BigInt → string            │
│  • Serialize nested objects          │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   HTTP Response                      │
│                                      │
│  200 OK                              │
│  Content-Type: application/json      │
│  {                                   │
│    "0": {                            │
│      "result": {                     │
│        "data": [...]                 │
│      }                               │
│    }                                 │
│  }                                   │
└──────────────────────────────────────┘
```

### tRPC Client Architecture

```
React Component
    │
    ▼
┌──────────────────────────────────────┐
│   useQuery Hook                      │
│   (from @trpc/react-query)           │
│                                      │
│  trpc.getUsers.useQuery(input)       │
│                                      │
│  • Call stored in React Query        │
│  • Automatic caching                 │
│  • Deduplication of identical calls  │
└────────┬───────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   tRPC React Query Integration       │
│                                      │
│  • Create query key from procedure   │
│  • Batch multiple queries            │
│  • Set staleTime (30s default)       │
└────────┬───────────────────────────┘
         │
         ├─ Check React Query cache
         │  ├─ Fresh data (staleTime) → Return immediately
         │  ├─ Stale data → Return cached, also fetch
         │  └─ No cache → Fetch
         │
         ▼
┌──────────────────────────────────────┐
│   tRPC Client                        │
│   (client.tsx setup)                 │
│                                      │
│  • HTTP Link (batch transport)       │
│  • BatchPolicy: every 5ms or 10 ops  │
└────────┬───────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   HTTP Request Batching              │
│                                      │
│  Requests within 5ms:                │
│  {                                   │
│    "0": { method: "query", ... },    │
│    "1": { method: "query", ... },    │
│    "2": { method: "mutation", ... }  │
│  }                                   │
│                                      │
│  Single POST to /api/trpc            │
└────────┬───────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   Server Processing                  │
│   (see server architecture above)    │
└────────┬───────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   Response (batched)                 │
│                                      │
│  {                                   │
│    "0": { result: [...] },           │
│    "1": { result: [...] },           │
│    "2": { result: [...] }            │
│  }                                   │
└────────┬───────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   Deserialization                    │
│   (superjson)                        │
│                                      │
│  • Parse JSON                        │
│  • Convert ISO strings → Date        │
│  • Type validation                   │
└────────┬───────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   React Query Cache Update           │
│                                      │
│  • setQueryData(queryKey, data)      │
│  • Notify all subscribers            │
│  • Trigger re-renders                │
└────────┬───────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   Component Re-render                │
│                                      │
│  useQuery returns:                   │
│  {                                   │
│    data: User[],                     │
│    isLoading: false,                 │
│    error: null,                      │
│    ...                               │
│  }                                   │
│                                      │
│  Component renders with data         │
└──────────────────────────────────────┘
```

### Server-Side Rendering Flow

```
GET / (from browser)
    │
    ▼
┌─────────────────────────────────────────────────┐
│  page.tsx (Server Component)                    │
│                                                 │
│  export default async function Home() {         │
│    const queryClient = getQueryClient()         │
│    ...                                          │
│  }                                              │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  getQueryClient()                               │
│  (src/trpc/query-client.ts)                     │
│                                                 │
│  • Create new React Query client                │
│  • Configure cache settings                     │
│  • staleTime: 30s                               │
│  • Enable dehydration                           │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  queryClient.prefetchQuery(                     │
│    trpc.getUsers.queryOptions()                 │
│  )                                              │
│                                                 │
│  • Execute tRPC query on server                 │
│  • tRPC router calls prisma directly            │
│  • Result cached in queryClient                 │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  dehydrate(queryClient)                         │
│                                                 │
│  Extract all cached data:                       │
│  {                                              │
│    queries: [                                   │
│      {                                          │
│        queryKey: ["trpc", "getUsers"],          │
│        state: {                                 │
│          data: [ { id: 1, email: ... } ]        │
│        }                                        │
│      }                                          │
│    ]                                            │
│  }                                              │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  Server rendering complete                      │
│                                                 │
│  <HydrationBoundary state={dehydrated}>         │
│    <Client /> <- Will use cached data           │
│  </HydrationBoundary>                           │
│                                                 │
│  Send HTML + JSON state to browser              │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  Browser receives HTML                          │
│                                                 │
│  • HTML is complete                             │
│  • Data already included                        │
│  • React mounts without loading state           │
│  • HydrationBoundary re-hydrates cache          │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  React Hydration                                │
│                                                 │
│  • Create new QueryClient                       │
│  • Load dehydrated state                        │
│  • Sync with React Query                        │
│  • useQuery hooks read cache                    │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  Page Display                                   │
│                                                 │
│  ✓ Data visible immediately                    │
│  ✓ No loading spinner                          │
│  ✓ No flash of unstyled content                │
│  ✓ Perfect Lighthouse metrics                  │
└─────────────────────────────────────────────────┘
```

---

## Component Relationships

### Chapter 2: Database Schema Relationships

```
                    ┌──────────────┐
                    │     User     │
                    ├──────────────┤
                    │ id (PK)      │
                    │ email (UNIQ) │◄── User signup
                    │ username     │
                    │ password*    │
                    │ createdAt    │
                    └──────────────┘
                           │
                           │ 1:M relationship
                           │ userId → User.id
                           │
                           ▼
                    ┌──────────────┐
                    │     Post     │
                    ├──────────────┤
                    │ id (PK)      │
                    │ title        │
                    │ content      │
                    │ userId (FK)◄────── Post belongsTo User
                    │ createdAt    │
                    └──────────────┘

* password field hash-only in database
```

### Chapter 3: Type Flow Relationships

```
┌─────────────────────────────────────────┐
│         Backend (Next.js API)           │
├─────────────────────────────────────────┤
│                                         │
│  Prisma Schema                          │
│  ├→ TypeScript types (generated)        │
│     ├→ tRPC Routers + Procedures        │
│     │  ├→ Zod Validators                │
│     │  ├→ Type inference (return)       │
│     │  └→ HTTP endpoint                 │
│     │                                   │
│     └→ tRPC Server Caller               │
│        └→ For server-side use           │
│                                         │
│  Exports: AppRouter type                │
└──────────┬───────────────────────────────┘
           │
           │ type-only import
           │
┌──────────▼───────────────────────────────┐
│       Frontend (React Client)            │
├─────────────────────────────────────────┤
│                                         │
│  import type { AppRouter }              │
│  ├→ tRPC React Client                   │
│  │  ├→ HTTP Link (JSON-RPC batch)       │
│  │  └→ Query Client (React Query)       │
│  │                                      │
│  ├→ Component Hooks                     │
│  │  ├→ trpc.getUsers.useQuery()         │
│  │  ├→ trpc.createUser.useMutation()    │
│  │  └→ Full TypeScript support          │
│  │                                      │
│  └→ Type safety in components           │
│     └→ Data & error types automatically │
│                                         │
└─────────────────────────────────────────┘
```

---

## Summary Matrix

| Aspect | Chapter 2 | Chapter 3 |
|--------|-----------|----------|
| **Architecture** | MVC (Model-View-Controller) | Full-Stack RPC |
| **Database** | Prisma Schema → PostgreSQL | Same + tRPC |
| **Security** | bcrypt for passwords | Middleware context validation |
| **Type Safety** | Prisma types | End-to-end (Prisma → tRPC → Client) |
| **API Layer** | Custom REST endpoints | tRPC routers & procedures |
| **Client Calls** | fetch() + manual typing | tRPC hooks (type-safe) |
| **Caching** | Manual or None | React Query built-in |
| **Serialization** | JSON.stringify/parse | superjson (Dates, BigInt, etc) |
| **Server Data** | Separate API calls | Prefetch + hydration |
| **Code Duplication** | API types + Client types | Zero (single source of truth) |

---

## Files Reference

### Chapter 2 Files
- `prisma/schema.prisma` - Database schema
- `src/lib/db.ts` - Prisma Client singleton
- `src/lib/password.ts` - Bcrypt utilities
- `src/lib/auth.ts` - Auth helpers
- `CHAPTER_2_SUMMARY.md` - Detailed documentation

### Chapter 3 Files
- `src/trpc/init.ts` - tRPC initialization
- `src/trpc/routers/_app.ts` - API procedures
- `src/trpc/server.tsx` - Server-side setup
- `src/trpc/client.tsx` - Client-side setup
- `src/trpc/query-client.ts` - React Query config
- `src/app/api/trpc/[trpc]/route.ts` - HTTP handler
- `src/app/page.tsx` - Server-side prefetch example
- `src/app/client.tsx` - Client-side query example
- `CHAPTER_3_SUMMARY.md` - Detailed documentation

---

## Performance Characteristics

### Chapter 2 Typical Metrics
| Operation | Time | Notes |
|-----------|------|-------|
| User creation | 200-300ms | Includes password hashing |
| User login | 150-250ms | Includes password verification |
| List users | 50-150ms | Database dependent |
| Database round-trip | 10-50ms | Neon serverless |
| bcrypt operation | 100-200ms | 10 salt rounds |

### Chapter 3 Typical Metrics
| Operation | Time | Notes |
|-----------|------|-------|
| Server prefetch | 50-100ms | Database + serialization |
| Browser hydration | 0ms | Data already loaded |
| Client query initial | 100-200ms | Network + server |
| Client query cached | 0ms | React Query cache hit |
| Batch 3 queries | ~150ms | Single HTTP round-trip |

---

## Next Steps

For detailed explanations, see:
- `SEQUENCE_DIAGRAMS.md` - Request/response flows
- `CHAPTER_2_SUMMARY.md` - Database deep-dive
- `CHAPTER_3_SUMMARY.md` - tRPC deep-dive
- `CONTRIBUTING.md` - Development guidelines

