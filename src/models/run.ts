import { Lab } from 'models/lab';

export interface Run {
  id: string;
  timestamp: number;
  user_id: string;
  type: string;
  lab: Lab;
}
