declare namespace jest {
  interface Matchers<R> {
    canRead(path: string, now?): boolean;
    cannotRead(path: string, now?): boolean;
    canWrite(path: string, newData: any, now?): boolean;
    cannotWrite(path: string, newData: any, now?): boolean;
    canPatch(path: string, newData: any, now?): boolean;
    cannotPatch(path: string, newData: any, now?): boolean;
  }
}

declare module 'jest-targaryen-matchers';
