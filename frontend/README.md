# RARA Platform Frontend

Frontend application for the RARA Tutoring Platform built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or the port shown) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── api/              # API client functions
│   │   ├── auth.ts       # Authentication API
│   │   ├── students.ts   # Students API
│   │   └── tutors.ts     # Tutors API
│   ├── api-client.ts     # Axios instance
│   └── utils.ts          # Utility functions
├── providers/            # React context providers
│   └── query-provider.tsx # TanStack Query provider
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dialog dropdown-menu table
```

## API Integration

The frontend is configured to connect to the NestJS backend. API clients are set up in `lib/api/`:

- **Auth API** (`lib/api/auth.ts`) - Login, user info
- **Students API** (`lib/api/students.ts`) - Student CRUD operations
- **Tutors API** (`lib/api/tutors.ts`) - Tutor CRUD operations

The API client automatically includes JWT tokens from localStorage in requests.

## Development

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Authentication

The app uses JWT tokens stored in localStorage. The API client automatically includes the token in requests.

## Next Steps

1. Create authentication pages (login, register)
2. Build student management UI
3. Build tutor management UI
4. Add routing and navigation
5. Implement role-based access control
