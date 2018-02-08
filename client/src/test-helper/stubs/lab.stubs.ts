import { ML_YAML_FILENAME } from '@machinelabs/core';
import { Lab } from '../../app/models/lab';

export const LAB_STUB: Lab = {
  id: 'some_id',
  user_id: 'some_user_id',
  name: 'Lab stub',
  description: '',
  tags: [],
  directory: [
    {
      name: 'main.py',
      content: ''
    },
    {
      name: ML_YAML_FILENAME,
      content: ''
    }
  ],
  created_at: Date.now(),
  modified_at: Date.now(),
  hidden: false,
  is_private: false
};
