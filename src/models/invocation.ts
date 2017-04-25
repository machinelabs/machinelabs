export enum InvocationType {
  StartExecution,
  StopExecution
}

export interface Invocation {
  id: string;
  timestamp: number;
  user_id: string;
  type: InvocationType;
  data: any;
}