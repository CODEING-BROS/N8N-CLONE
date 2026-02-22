# N8N Clone

A workflow automation platform inspired by n8n. This project enables users to create, manage, and execute complex automation workflows with a visual interface.

## Project Structure

```
N8NCLONE/
├── backend/          # Server-side application
└── frontend/         # Client-side application
```

## Tech Stack

### Prerequisites
- **Node.js**: v18.18 or higher
- **npm**: v9 or higher

### Backend
- **Language**: Node.js
- **Framework**: (To be determined)
- **Database**: (To be determined)
- **API**: REST/GraphQL (To be determined)
- **Dependencies**: (Check `backend/package.json` for details)

### Frontend
- **Framework**: Next.js 15.5.4 (with Turbopack)
- **Language**: TypeScript
- **UI Library**: shadcn/ui (with Radix UI)
- **Styling**: Tailwind CSS 4
- **Form Handling**: React Hook Form
- **State Management**: (To be determined)
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Code Quality**: Biome (linting & formatting)
- **Key Dependencies**:
  - React 19.1.0
  - React DOM 19.1.0
  - Zod (validation)
  - Next Themes (dark mode)
  - React Resizable Panels
  - Embla Carousel

## Getting Started

### Prerequisites
- Node.js v18.18 or higher
- npm or yarn

### Installation

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Backend Setup
```bash
cd backend
npm install
```

### Running the Application

#### Start Frontend (Development)
```bash
cd frontend
npm run dev
# Application will be available at http://localhost:3000
```

#### Start Frontend (Production Build)
```bash
cd frontend
npm run build
npm start
```

#### Start Backend
```bash
cd backend
npm run dev
# or for production
npm start
```

### Code Quality

#### Frontend Linting & Formatting
```bash
cd frontend
npm run lint          # Check code style
npm run format        # Auto-format code
```

## Project Features

- Visual workflow builder
- Node-based automation
- Workflow execution and monitoring
- (Add more features as implemented)

## Setup Completed ✅

- [x] Environment setup - Node.js v18.18+
- [x] Next.js application with Turbopack
- [x] shadcn/ui component library
- [x] GitHub repository initialized
- [ ] Backend API setup
- [ ] Database configuration
- [ ] Authentication system
- [ ] Workflow engine
- [ ] WebSocket for real-time updates

## Development

Add development guidelines, scripts, and conventions here.

## Contributing

Guidelines for contributing to this project.

## License

Specify your project license.

---

**Last Updated**: February 22, 2026 - Setup Phase Complete
**Status**: In Development
**Note**: This README will be updated as the project evolves.
