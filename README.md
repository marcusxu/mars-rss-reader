<p align="center">
  <img src="assets/logo.png" alt="Mars RSS Reader Logo" width="200">
</p>

# Mars RSS Reader

A full-stack RSS Reader application with a NestJS backend and React frontend. The backend provides a robust API for managing RSS subscriptions and articles, while the frontend offers a clean user interface for reading feeds.

## Features

### Backend
- Manage RSS subscriptions (CRUD operations)
- Fetch and parse RSS feeds automatically
- Batch article operations (mark multiple articles as read in a single request)
- Optimized API with N+1 query prevention
- Pagination support for all list endpoints
- Comprehensive filtering and search capabilities
- Environment-based configuration
- Swagger API documentation
- Unit test coverage

### Frontend
- Article feed display with pagination
- Mark articles as read/unread, favorite/unfavorite
- Batch operations (mark all as read)
- Subscription management (add, delete)
- Search articles by title
- Feed refresh and cleanup operations
- Category display for subscriptions
- Responsive Material UI design

## API Documentation

- Swagger UI: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/articles` | Get paginated articles with filters |
| GET | `/articles/search` | Search articles |
| GET | `/articles/:id` | Get article by ID |
| PATCH | `/articles/:id` | Update article (isRead, isFavorite) |
| PATCH | `/articles/batch-update` | Batch update articles |
| GET | `/subscriptions` | Get paginated subscriptions |
| POST | `/subscriptions` | Create subscription |
| PATCH | `/subscriptions/:id` | Update subscription |
| DELETE | `/subscriptions/:id` | Delete subscription |
| PATCH | `/feeds/update/:id` | Update feed for subscription |
| PATCH | `/feeds/update-all` | Update all feeds |
| PATCH | `/feeds/cleanup/:id` | Cleanup articles for subscription |
| PATCH | `/feeds/cleanup-all` | Cleanup all articles |

## Roadmap

- [x] Support for managing subscriptions
- [x] Support for managing feeds (update, cleanup)
- [x] GUI for the app
- [ ] Tag operation for subscriptions and articles
- [ ] App settings management (cache, preferences)
- [ ] Authentication and authorization
- [ ] Article content preview in app
- [ ] Advanced filtering (by author, content, subscription, read/favorite status)
- [ ] Error notifications and loading indicators
- [ ] Update subscription in frontend
- [ ] Delete individual articles

## Tech Stack

### Backend
- TypeScript
- NestJS
- TypeORM
- SQLite
- Swagger
- RSS Parser
- Jest (testing)

### Frontend
- Vite
- React 18
- TypeScript (strict mode)
- MUI (Material UI)
- Axios
- React Router

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (>= 14.x) installed on your machine.

## Installation

1. Clone the repository:

```shell
git clone https://github.com/marcusxu/mars-rss-reader.git
```

2. Install dependencies:

```shell
npm install
```

## Running the app

```shell
# development mode (both frontend and backend)
npm run start

# backend only
cd backend && npm run start:dev

# frontend only
cd frontend && npm run dev
```

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`

## Building

```shell
# build both
npm run build

# backend only
cd backend && npm run build

# frontend only
cd frontend && npm run build
```

## Testing

### Backend

```shell
cd backend

# run all tests
npm test

# run tests with coverage
npm run test:cov

# run tests in watch mode
npm run test:watch

# run e2e tests
npm run test:e2e
```

### Frontend

No test framework configured yet.

## Linting

```shell
# backend
cd backend && npm run lint

# frontend
cd frontend && npm run lint
```

## Project Structure

```
mars-rss-reader/
├── backend/                  # NestJS backend
│   ├── src/
│   │   ├── articles/         # Articles module
│   │   ├── subscriptions/    # Subscriptions module
│   │   ├── feeds/            # Feeds module
│   │   └── common/           # Shared utilities
│   └── test/                 # Test files
└── frontend/                 # React frontend
    └── src/
        ├── components/       # Reusable UI components
        ├── pages/            # Route-level components
        ├── services/         # API calls
        ├── hooks/            # Custom React hooks
        └── utils/            # Helper functions
```

## Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Backend Configuration

The backend uses SQLite by default. Configuration can be modified in `backend/src/app.module.ts`.

Database file is automatically created at `backend/rss-reader.db`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Support

If you have any questions or need help, please open an issue in the GitHub repository.
