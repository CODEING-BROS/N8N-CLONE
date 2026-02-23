# Chapter 4: Authentication

This chapter documents the BetterAuth authentication setup, UI flows, and protected tRPC access.

## Overview

- BetterAuth configured with Prisma adapter in `src/lib/auth.ts`
- Auth API route handled at `src/app/api/auth/[...all]/route.ts`
- Auth client available in `src/lib/auth-client.ts`
- Login and register UI components in `src/features/auth/components`
- Protected tRPC access via `protectedProcedure` in `src/trpc/init.ts`

## Sequence Diagrams

### Sign Up Flow

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

### Sign In Flow

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

### Protected tRPC Procedure Flow

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

### Auth UI Navigation

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

### Session Validation

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

## Notes

- These diagrams reflect the current BetterAuth-based flow in the repo.
- If you add a dedicated tRPC auth router, update the protected flow to include those procedures.
