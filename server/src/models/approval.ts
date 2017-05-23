import { Invocation } from './invocation';

export interface Approval {
  allowExecution: boolean;
  message: string;
  invocation: Invocation;
}