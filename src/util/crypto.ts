import { createHash } from 'crypto';
import { Lab } from 'models/lab';

export class Crypto {
  static hashLabFiles(lab: Lab) {
    return Crypto.hash(JSON.stringify(lab.files));
  }

  static hash(val: string) {
    const hasher = createHash('sha256');
    return hasher.update(val).digest('hex');
  }
}