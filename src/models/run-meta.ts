export enum ExecutionStatus {
  Started,
  Finished,
  Stopped
}

export interface RunMeta {
  id: string;
  file_set_hash: string;
  started_at: number;
  finished_at: number,
  server_info: string
  user_id: string;
  status: ExecutionStatus;
}
