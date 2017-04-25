import { File } from './lab';

export enum InvocationType {
  StartExecution,
  StopExecution
}

export interface Lab {
  id: string;
  files: File[];
}

export interface Invocation {
  id: string;
  timestamp: number;
  type: InvocationType;
  data: any;
}
