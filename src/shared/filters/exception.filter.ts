import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from 'class-validator';

const defaultErrorMessage =
  'Request could not be processed at the moment. Please try again later';

const isXML = (str: string) => /^\s*<[\s\S]*>/.test(str);

const isInternalErrMessage = (message: string) => {
  try {
    if (message && typeof message === 'string') message = message.toLowerCase();
    return (
      typeof message === 'string' &&
      (isXML(message) ||
        message.includes('internal') ||
        message.includes('timeout') ||
        message.includes('apache') ||
        message.includes('unknown'))
    );
  } catch {
    return false;
  }
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorCode =
      exception instanceof HttpException
        ? 'bad_request'
        : 'internal_server_error';

    let errorMessage = 'Request Could not be Processed';
    let errorDetails: Record<string, any> | string = {};

    if (exception instanceof HttpException || exception instanceof Error) {
      errorCode = 'bad_request';
      errorMessage = exception.message;

      if (exception instanceof Error) statusCode = 400;

      if (exception instanceof HttpException)
        errorDetails = exception.getResponse();
    } else if (
      exception instanceof Array &&
      exception[0] instanceof ValidationError
    ) {
      statusCode = 400;
      errorMessage = 'Validation failed';
      errorCode = 'validation_error';
      errorDetails = (exception as ValidationError[]).map(
        (e: ValidationError) => ({
          field: (e as unknown as { property: string }).property,
          message: Object.values(
            (e as unknown as { constraints: Record<string, string> })
              .constraints || {},
          ).join(' | '),
        }),
      );
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      'message' in exception
    ) {
      statusCode = 400;
      errorMessage =
        typeof exception.message === 'string'
          ? exception.message
          : defaultErrorMessage;

      errorCode = 'bad_request';
    } else if (typeof exception === 'string') {
      statusCode = 400;
      errorMessage = exception;

      errorCode = 'bad_request';
    } else {
      console.log(exception);
      this.logger.error(exception);
    }

    if (errorDetails && typeof errorDetails === 'object') {
      if (errorDetails.message) {
        errorMessage = errorDetails.message as string;
        errorDetails.message = undefined;
      }
      if (errorDetails.statusCode) errorDetails.statusCode = undefined;
    }

    if (errorMessage && isInternalErrMessage(errorMessage)) {
      console.log(exception);

      this.logger.error(exception);

      errorMessage = defaultErrorMessage;

      errorDetails = { isClientError: true };
    }

    if (
      process.env.NODE_ENV === 'development' ||
      errorMessage === defaultErrorMessage
    ) {
      this.logger.error(exception);
    }

    const responseBody = {
      status: 'failed',
      error_description: errorMessage,
      error: errorCode,
      error_details: errorDetails,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
