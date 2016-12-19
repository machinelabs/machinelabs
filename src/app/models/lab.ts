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
