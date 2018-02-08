import 'jest';

import { LabConfigService } from './lab-config.service';
import { Lab } from '@machinelabs/models';
import { ML_YAML_FILENAME } from '@machinelabs/core';
import { PublicLabConfiguration } from '../models/lab-configuration';

let dockerImageId = 'keras_v2-4-x_python_2';

let validConfig = `
dockerImageId: ${dockerImageId}
`;

let invalidConfig = `
|||
dockerImageId= ${dockerImageId}
`;

let lab: Lab = {
  id: 'some-lab',
  name: '',
  description: '',
  tags: [],
  user_id: '',
  created_at: Date.now(),
  modified_at: Date.now(),
  hidden: false,
  directory: [
    {
      name: ML_YAML_FILENAME,
      content: validConfig
    }
  ],
  is_private: false
};

let labWithPascalCase: Lab = {
  id: 'some-lab',
  name: '',
  description: '',
  tags: [],
  user_id: '',
  created_at: Date.now(),
  modified_at: Date.now(),
  hidden: false,
  directory: [
    {
      name: 'Ml.yaml',
      content: validConfig
    }
  ],
  is_private: false
};

let labWithInvalidConfig: Lab = {
  id: 'some-lab',
  name: '',
  description: '',
  tags: [],
  user_id: '',
  created_at: Date.now(),
  modified_at: Date.now(),
  hidden: false,
  directory: [
    {
      name: 'Ml.yaml',
      content: invalidConfig
    }
  ],
  is_private: false
};

let labWithoutConfig: Lab = {
  id: 'some-lab',
  name: '',
  description: '',
  tags: [],
  user_id: '',
  created_at: Date.now(),
  modified_at: Date.now(),
  hidden: false,
  directory: [],
  is_private: false
};

let svc: LabConfigService;

beforeEach(() => {
  svc = new LabConfigService(null, null);

});

describe('.readConfig(lab)', () => {
  it('should return parsed PublicLabConfiguration', () => {
    let config: PublicLabConfiguration = svc.readPublicConfig(lab);
    expect(config.dockerImageId).toBe(dockerImageId);
  });

  it('should return parsed PublicLabConfiguration no matter file name casing', () => {
    let config: PublicLabConfiguration = svc.readPublicConfig(labWithPascalCase);
    expect(config.dockerImageId).toBe(dockerImageId);
  });

  it('should return null for invalid configs', () => {
    let config: PublicLabConfiguration = svc.readPublicConfig(labWithInvalidConfig);
    expect(config).toBeNull();
  });

  it('should return null if config does not exist', () => {
    let config: PublicLabConfiguration = svc.readPublicConfig(labWithoutConfig);
    expect(config).toBeNull();
  });

});
