export enum ExecutionEnv {
  /**
   * Execution environment where the application is serving real users.
   */
  PRODUCTION = 'production',

  /**
   * Execution environment where logging can be verbose to ease debugging.
   */
  DEVELOP = 'develop',
}

export enum EnvConfigKeys {
  HOST = 'HOST',
  PORT = 'PORT',
  CLIENT_URL = 'CLIENT_URL',
  DATABASE_URL = 'DATABASE_URL',
  // Postgres
  PG_USER = 'PG_USER',
  PG_PASSWORD = 'PG_PASSWORD',
  PG_DATABASE = 'PG_DATABASE',
  // Firebase
  FIREBASE_PRIVATE_KEY = 'FIREBASE_PRIVATE_KEY',
  // Resend
  RESEND_API_KEY = 'RESEND_API_KEY',
  RESEND_EMAIL_FROM = 'RESEND_EMAIL_FROM',
  // AWS
  AWS_REGION = 'AWS_REGION',
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
  AWS_BACKUP_BUCKET = 'AWS_BACKUP_BUCKET',
}
