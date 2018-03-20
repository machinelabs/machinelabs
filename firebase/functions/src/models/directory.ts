// DO NOT EDIT. COPY FROM @machinelabs/models instead

export interface DirectoryClientState {
  collapsed?: boolean;
  selected?: boolean;
}

export interface File {
  name: string;
  content: string;
  clientState?: DirectoryClientState;
}

export interface Directory {
  name: string;
  contents: Array<File | Directory>;
  clientState?: DirectoryClientState;
}

export type LabDirectory = Array<File | Directory>;

export const isLabDirectory = (object: any): object is LabDirectory => {
  return Array.isArray(object);
};

export const instanceOfFile = (object: any): object is File => {
  return object && 'content' in object;
};

export const instanceOfDirectory = (object: any): object is Directory => {
  return object && 'contents' in object;
};
