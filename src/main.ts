import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationError, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AllExceptionsFilter } from './shared';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      // json: true,
      timestamp: true,
    }),
  });
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.enableCors();
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
      },
    }),
  );
  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // validate dtos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return validationErrors; // handling in exception filter
      },
    }),
  );
  // transform true - @Transform decorator applied from dto

  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(json());

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
