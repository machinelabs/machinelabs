import { Execution, ExecutionStatus } from './execution';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface File {
  name: string;
  content: string;
}

export interface LabTemplate {
  name: string;
  description: string;
  tags: string[];
  directory: File[];
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
