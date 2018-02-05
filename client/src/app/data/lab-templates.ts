import { SIMPLE_XOR_LAB_CODE } from './xor-lab-code';
import { SIMPLE_MNIST_CODE } from './mnist-lab-code';
import { ML_YAML } from '@machinelabs/core';

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
  },
  'mnist': {
    name: 'Simple MNIST',
    description: `A neural net learning to recognize hand-written
      digits using the MNIST dataset.`,
    tags: ['MNIST'],
    directory: [{
      name: 'main.py',
      content: SIMPLE_MNIST_CODE
    },
    {
      name: 'ml.yaml',
      content: ML_YAML
    }]
  }
};
