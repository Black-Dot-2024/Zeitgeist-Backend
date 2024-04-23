import * as admin from 'firebase-admin';
import { EnvConfigKeys } from '../utils/constants';

/**
 * Firebase Admin SDK initialization
 */
const privateKey = process.env[EnvConfigKeys.FIREBASE_PRIVATE_KEY];
if (!privateKey) {
  throw new Error('INTERNAL_SERVER_ERROR: Firebase private key is not set');
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(privateKey) as admin.ServiceAccount),
});

export default admin;
