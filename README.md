<p align="center">
  <img src="assets/logo.png" alt="Mars RSS Reader Logo" width="200">
</p>

# Mars RSS Reader

A full-stack RSS Reader application with a NestJS backend and React frontend. The backend provides a robust API for managing RSS subscriptions and articles, while the frontend offers a clean user interface for reading feeds.

## Features

- Manage RSS subscriptions
- Fetch and parse RSS feeds
- Batch article operations (mark multiple articles as read in a single request)
- Optimized API with N+1 query prevention
- Environment-based configuration

## API Documentation

- Swagger UI: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`

## Roadmap

- [x] Support for managing subscriptions
- [ ] [API] Tag operation for subscriptions and articles
- [ ] Support for managing feeds
- [x] GUI for the app
- [ ] Support for app settings, including manage cache

## Tech Stack

### For Backend

- TypeScript
- NestJS
- TypeORM
- SQLite
- Swagger
- RSS Parser

### For Frontend

- Vite
- React
- MUI
- Axios

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
# development mode
npm run start
```

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`

## Project Structure

```
|_backend: A NestJS backend project.
|_frontend: A React frontend project.

```

## Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Backend Configuration

The backend uses SQLite by default. Configuration can be modified in `backend/src/app.module.ts`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Support

If you have any questions or need help, please open an issue in the GitHub repository.
