import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception_filters/http-exception.filter';
import 'dotenv/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  logger.log('Starting Mars RSS Reader API...');

  const config = new DocumentBuilder()
    .setTitle('RSS Reader API')
    .setDescription('The RSS Reader API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Mars RSS Reader API is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api`);
  logger.log(`🏥 Health Check: http://localhost:${port}/health`);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.log('SIGTERM signal received: closing HTTP server');
    app.close();
  });
}
bootstrap();
