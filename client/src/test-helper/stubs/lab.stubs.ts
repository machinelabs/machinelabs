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
      name: 'ml.yaml',
      content: ''
    }
  ],
  created_at: Date.now(),
  modified_at: Date.now()
};
