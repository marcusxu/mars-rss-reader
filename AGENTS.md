# AGENTS.md - Mars RSS Reader

This document provides guidance for AI coding agents working in this repository.

## Project Overview

Mars RSS Reader is a monorepo containing a React frontend (Vite + MUI) and NestJS backend with TypeORM/SQLite.

## Build Commands

### Root Level
```bash
npm run start              # Start both frontend and backend in dev mode
npm run build              # Build both frontend and backend
```

### Backend (in /backend)
```bash
npm run build              # Build NestJS application
npm run start:dev          # Start in development mode with watch
npm run start              # Start production build
npm run format             # Format code with Prettier
```

### Frontend (in /frontend)
```bash
npm run dev                # Start Vite dev server
npm run build              # Build for production (TypeScript check + Vite build)
npm run preview            # Preview production build
```

## Lint Commands

### Backend
```bash
npm run lint               # Run ESLint with auto-fix
```

### Frontend
```bash
npm run lint               # Run ESLint
```

## Test Commands

### Backend
```bash
npm test                              # Run all tests
npm run test:watch                    # Run tests in watch mode
npm run test:cov                      # Run tests with coverage
npm run test:e2e                      # Run e2e tests

# Running a single test file
npx jest test/articles/articles.service.spec.ts

# Running a single test by name
npm test -- --testNamePattern="should update an article successfully"
```

### Frontend
No test framework configured yet.

## Code Style Guidelines

### Formatting (Prettier)
- **Single quotes** for strings (no double quotes)
- **Trailing commas** always (ES5 compatible)
- No explicit print width or tab width specified

### TypeScript Configuration
- **Backend**: Relaxed mode (strictNullChecks: false, noImplicitAny: false)
- **Frontend**: Strict mode enabled (strict: true, noUnusedLocals: true, noUnusedParameters: true)
- Target: ES2021 (backend), ES2020 (frontend)

### Import Style
**Backend**:
- Use absolute imports with `src/` prefix: `import { Article } from 'src/articles/entities/article.entity'`
- Group imports: external packages first, then internal modules

**Frontend**:
- Use relative imports: `import { useArticles } from '../hooks/use-articles'`
- Import destructuring for multiple items from same package

### Naming Conventions

**Files and Directories**:
- Use kebab-case: `articles.service.ts`, `feeds-page.tsx`
- Test files: `*.spec.ts` (backend), no pattern yet for frontend

**Backend Classes/Interfaces**:
- Classes: PascalCase (`ArticlesController`, `ArticlesService`)
- Interfaces: PascalCase without prefix (`HealthCheckResponse`, not `IHealthCheckResponse`)
- Methods/properties: camelCase (`healthCheck`, `updateArticle`)

**Frontend Components**:
- Components: PascalCase (`FeedsPage`, `SubscriptionsPage`)
- Custom hooks: camelCase with `use` prefix (`useArticles`)
- Utility functions: camelCase (`formatDate`)

### Decorators (Backend)
- Use NestJS decorators: `@Controller`, `@Injectable`, `@Get`, `@Post`, `@Patch`, `@Delete`
- Use TypeORM decorators: `@Entity`, `@Column`, `@ManyToOne`, `@PrimaryGeneratedColumn`
- Use validation decorators: `@IsString`, `@IsOptional`, `@IsBoolean`, `@IsArray`
- Use Swagger decorators: `@ApiTags`, `@ApiOperation`, `@ApiProperty`, `@ApiPropertyOptional`

### React Patterns (Frontend)
- Use functional components with hooks (no class components)
- Extract custom hooks for complex logic (see `use-articles.ts`)
- Use MUI components for UI: `Container`, `Box`, `Grid`, `Button`, `Typography`, etc.
- Handle loading and error states explicitly

## Error Handling

### Backend
- Use NestJS built-in exceptions: `NotFoundException`, `BadRequestException`, etc.
- Global exception filter (`HttpExceptionFilter`) catches all exceptions
- Log errors with NestJS Logger: `this.logger.error('message', error)`
- Return structured error responses: `{ statusCode, timestamp, path, message }`

### Frontend
- Use try-catch in service functions
- Return error status objects: `{ status: number, message: string }`
- Display error messages to users in components

## Testing Patterns

### Backend Unit Tests
- Test files located in `backend/test/**/*.spec.ts`
- Use `@nestjs/testing` Test utilities
- Mock dependencies using `jest.fn()` and `useValue`
- Mock TypeORM repositories with `getRepositoryToken()`
- Structure: `describe('ClassName', () => { ... })`
- Use `beforeEach` for setup, `afterEach` for cleanup
- Test both success and error cases

### Example Test Structure
```typescript
describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;
  
  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: getRepositoryToken(Article), useValue: mockRepository },
      ],
    }).compile();
    
    service = module.get<ArticlesService>(ArticlesService);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
});
```

## Architecture Patterns

### Backend
- **Module structure**: Each feature has its own module (`articles.module.ts`)
- **Controller**: Handles HTTP requests, delegates to service
- **Service**: Business logic, interacts with repositories
- **DTOs**: Data Transfer Objects for request/response validation
- **Entities**: TypeORM entities for database models
- **Common**: Shared utilities (pagination, filters, exceptions)

### Frontend
- **Pages**: Route-level components (`feeds-page.tsx`, `subscriptions-page.tsx`)
- **Components**: Reusable UI components (`navigator.tsx`)
- **Services**: API calls using axios (`article-service.ts`, `subscription-service.ts`)
- **Hooks**: Custom React hooks for stateful logic (`use-articles.ts`)
- **Utils**: Helper functions (`date-util.ts`)

## Important Notes

- Backend runs on port 3000 by default, frontend on 3001
- SQLite database file is created automatically
- Swagger API docs available at `http://localhost:3000/api`
- Health check endpoint: `http://localhost:3000/health`
- CORS enabled for frontend origin
- Use `dotenv` for environment variables in backend
- No comments in code unless explicitly requested

## Common Tasks

### Adding a new backend feature
1. Create module: `nest g module feature-name`
2. Create controller: `nest g controller feature-name`
3. Create service: `nest g service feature-name`
4. Create entity in `entities/` directory
5. Create DTOs in `dto/` directory
6. Write tests in `test/feature-name/`
7. Register module in `app.module.ts`

### Adding a new frontend page
1. Create component in `pages/` directory
2. Add route in `main.tsx`
3. Create service functions in `services/`
4. Create custom hooks if needed in `hooks/`
5. Use MUI components for UI

### Running tests before committing
```bash
cd backend && npm test && npm run lint
cd ../frontend && npm run lint && npm run build
```
