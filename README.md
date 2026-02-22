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
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Post Model
```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

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

**Last Updated**: February 22, 2026  
**Current Chapter**: Chapter 2 - Database and ORM ✅
