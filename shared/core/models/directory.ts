export interface File {
  name: string;
  content: string;
}

export interface Directory {
  name: string;
  contents: Array<File|Directory>;
}

export type LabDirectory = Array<File|Directory>;

export const instanceOfFile = (object: any): object is File => {
  return object && 'content' in object;
};

export const instanceOfDirectory = (object: any): object is Directory => {
  return object && 'contents' in object;
};
