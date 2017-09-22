import { File } from '@machinelabs/core/models/directory';

export enum InvocationType {
  StartExecution = 'start_execution',
  StopExecution = 'stop_execution'
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

