import { File } from '@machinelabs/core/models/directory';

export class Directory {

  static isSameDirectory(a: File[], b: File[]) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }
}
