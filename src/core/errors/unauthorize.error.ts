import { BaseError } from './core/base-error.error';
import { BaseErrorCode } from './core/error-code.enum';

/**
 * Error for handling authorization issues.
 * @example throw new UnauthorizedError('Authorization token is required');
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super({
      code: BaseErrorCode.UNAUTHORIZED_RESOURCE,
      message: message,
      errors: [{ message: message }],
    });
  }
}
