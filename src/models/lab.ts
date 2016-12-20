//TODO: Move this into a lib that can be shared among server and client
export enum LabStatus {
  Pristine,
  Running,
  Done,
  Error
}

export interface File {
  name: string;
  content: string;
}

export interface Lab {
  id: string;
  userId: string;
  name: string;
  description: string;
  tags: string[];
  files: File[];
  status: LabStatus;
}
