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
  // Firebase
  FIREBASE_API_KEY = 'FIREBASE_API_KEY',
  FIREBASE_AUTH_DOMAIN = 'FIREBASE_AUTH_DOMAIN',
  FIREBASE_PROJECT_ID = 'FIREBASE_PROJECT_ID',
  FIREBASE_STORAGE_BUCKET = 'FIREBASE_STORAGE_BUCKET',
  FIREBASE_MESSAGING_SENDER_ID = 'FIREBASE_MESSAGING_SENDER_ID',
  FIREBASE_APP_ID = 'FIREBASE_APP_ID',
  FIREBASE_PRIVATE_KEY = 'FIREBASE_PRIVATE_KEY',
}
