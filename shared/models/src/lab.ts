import { LabDirectory } from './directory';

export interface Lab {
  id: string;
  name: string;
  description: string;
  tags: string[];
  directory: LabDirectory;
  user_id: string;
  has_cached_run?: boolean;
  created_at: number;
  modified_at: number;
  hidden: boolean;
  fork_of?: string;
  is_private: boolean;
}
