import { File } from './lab';

export enum InvocationType {
  StartExecution = 'start',
  StopExecution = 'stop'
}

export interface InvocationLab {
  id: string;
  directory: File[];
}

export interface Invocation {
  id: string;
  timestamp: number;
  type: InvocationType;
  data: any;
}

