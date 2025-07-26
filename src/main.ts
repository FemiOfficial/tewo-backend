import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AllExceptionsFilter } from './shared';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);
  // app.useLogger(app.get(LoggerService));

  app.enableCors();

  app.use(helmet());
  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // app.setGlobalPrefix('core');

  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   prefix: 'v',
  //   defaultVersion: '1',
  // });

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

  app.use(json());

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
