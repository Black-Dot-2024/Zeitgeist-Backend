interface BaseErrorOptions {
  message?: string;
  errors?: ReadonlyArray<any>;
  code: string;
  innerError?: Error;
}

export abstract class BaseError<TErrors = any> extends Error {
  public readonly code: string;
  public readonly errors: ReadonlyArray<TErrors>;
  public readonly innerError?: Error;

  /**
   * Creates a new instance of BaseError
   *
   * @param {BaseErrorOptions} options - The options for creating an error
   */
  constructor(options: BaseErrorOptions) {
    const { code, errors, message = '', innerError } = options;
    super(message);

    this.code = code;
    this.errors = errors as ReadonlyArray<any>;
    this.innerError = innerError;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Converts the error to a plain object for serialization
   *
   * @returns {Record<string, any>} A plain object representing the error
   */
  public toJSON(): Record<string, any> {
    const { code, message, errors, innerError } = this;

    return {
      code,
      message,
      errors,
      innerError,
    };
  }
}
