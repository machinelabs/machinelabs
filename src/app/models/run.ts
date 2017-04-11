import { File } from './lab';

export enum RunAction {
  Run = 0,
  Stop = 1
}

export interface Lab {
  id: string;
  files: File[];
}

export interface Run {
  id: string;
  timestamp: number;
  type: RunAction;
  lab: Lab;
}
