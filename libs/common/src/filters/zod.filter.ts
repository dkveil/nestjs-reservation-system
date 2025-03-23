import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 400;

    response.status(status).json({
      errors: exception.errors,
      message: exception.message,
      statusCode: status,
    });
  }
}
