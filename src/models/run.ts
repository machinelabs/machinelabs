import { Lab } from 'models/lab';

export enum RunAction {
  Run,
  Stop
}

export interface Run {
  id: string;
  timestamp: number;
  user_id: string;
  type: RunAction;
  lab: Lab;
}
