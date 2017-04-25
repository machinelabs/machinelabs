import { Invocation } from './invocation';

export interface Approval {
  allowExecution: boolean;
  maxTime: number,
  message: string;
  invocation: Invocation;
}