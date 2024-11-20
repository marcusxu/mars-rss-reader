# Mars RSS Reader

A robust RSS Reader API built with NestJS framework. This service allows users to fetch and parse RSS feeds efficiently.

## Features

- Fetch and parse RSS feeds
- RESTful API design
- API documentation with Swagger

## Roadmap

- [ ] Support for managing subscriptions
- [ ] Support for managing feeds
- [ ] GUI for the app

## Tech Stack

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Jest](https://jestjs.io/) - Delightful JavaScript Testing Framework
- [Swagger](https://swagger.io/) - API Documentation Tool

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (>= 14.x) installed on your machine.

## Installation

1. Clone the repository:

```shell
git clone https://github.com/yourusername/rss-reader-api.git
cd rss-reader-api
```

2. Install dependencies:

```shell
npm install
```

## Running the app

```shell
# development mode
npm run start

# watch mode
npm run start:dev
```

The application will be available at `http://localhost:3000`.

## API Documentation

After starting the application, you can access the Swagger UI at `http://localhost:3000/api` to view the complete API documentation.

## Testing

```shell
# unit tests
npm run test
```

## Usage Example

Fetch an RSS feed using curl:

```shell
curl 'http://localhost:3000/rss?url=https://example.com/rss-feed'
```

## Project Structure

```
src/
├── rss/
│   ├── rss.controller.ts
│   ├── rss.service.ts
│   ├── rss.module.ts
│   └── rss.controller.spec.ts
├── app.module.ts
└── main.ts
```

## Configuration

Environment variables can be configured in the `.env` file. Example:

```
PORT=3000
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Acknowledgements

- [NestJS Documentation](https://docs.nestjs.com/)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)

## Support

If you have any questions or need help, please open an issue in the GitHub repository.
