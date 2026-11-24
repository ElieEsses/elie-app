# Elie's Apps

My central React frontend for personal projects, with shared authentication, components, and API integrations.

## Projects

- **Digital Library** — Book management, reading progress, ratings, notes, and NFC integration.

## Prerequisites

- Node.js and npm
- [just](https://github.com/casey/just)

## Getting Started

Install dependencies:

```bash
npm ci
```

Create a local environment file:

```bash
cp .env.example .env
```

Fill in required variables.

Start the development server:

```bash
just run
```

The application is available at [localhost:5173](http://localhost:5173).

## Routes

| Route | Description |
|---|---|
| `/` | Redirect to `/library` (for now) |
| `/login` | Login page |
| `/library` | Library dashboard |
| `/library/:bookId` | Book details |

## Development Commands

Commands are defined in the `justfile`.

| Command | Description |
|---|---|
| `just run` | Start the development server |
| `just lint` | Run ESLint with automatic fixes |
| `just format` | Run Prettier |
| `just check` | Lint and format |
| `just build` | Build for production |
| `just tunnel` | Start a Cloudflare tunnel |
| `just deploy "message"` | Run deployment workflow |

Run `just --list` to see all commands.

## Project Structure

```text
src/
├── App.jsx
├── components/
├── lib/
├── pages/
└── styles/
```

Authentication is handled by Supabase. Application data and business logic are managed by the FastAPI backend.