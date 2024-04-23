import { BaseError } from './core/base-error.error';
import { BaseErrorCode } from './core/error-code.enum';

/**
 * Represents an error that occurs when an entity is not found
 *
 * @example throw new NotFoundError('Entity not found');
 */
export class NotFoundError extends BaseError {
  constructor(resourceName = 'resource') {
    super({
      code: BaseErrorCode.NOT_FOUND,
      message: `Requested ${resourceName} was not found`,
      errors: [resourceName],
    });
  }
}
