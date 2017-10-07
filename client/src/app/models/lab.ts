import { LabDirectory } from '@machinelabs/core/models/directory';

export interface LabTemplate {
  name: string;
  description: string;
  tags: string[];
  directory: LabDirectory;
}

export interface Lab extends LabTemplate {
  id: string;
  user_id: string;
  has_cached_run?: boolean;
  created_at: number;
  modified_at: number;
  hidden: boolean;
  fork_of?: string;
}
