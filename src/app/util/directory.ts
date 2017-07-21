import { File } from '../models/lab';

export class Directory {

  static isSameDirectory(a: File[], b: File[]) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }
}
