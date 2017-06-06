import { SIMPLE_XOR_LAB_CODE } from './xor-lab-code';
import { ML_YAML } from './ml.yaml';

export const LAB_TEMPLATES = {
  'xor': {
    name: 'XOR Template',
    description: '',
    tags: [],
    directory: [{
      name: 'main.py',
      content: SIMPLE_XOR_LAB_CODE
    }, {
      name: 'ml.yaml',
      content: ML_YAML
    }]
  }
};
