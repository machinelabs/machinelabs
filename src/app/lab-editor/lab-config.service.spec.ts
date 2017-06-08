import { LabConfigService } from './lab-config.service';
import { Lab } from '../models/lab';
import { PublicLabConfiguration } from '../models/lab-configuration';

let dockerImageId = 'keras_v2-4-x_python_2';

let validConfig = `dockerImageId: ${dockerImageId}`;

let invalidConfig = `dockerImageId= ${dockerImageId}`;

let lab: Lab = {
  id: 'some-lab',
  name: 'Some Lab',
  description: '',
  user_id: '3',
  tags: [],
  has_cached_run: false,
  directory: [
    {
      name: 'ml.yaml',
      content: validConfig
    }
  ]
};

let labWithPascalCase: Lab = {
  id: 'some-lab',
  name: 'Some Lab',
  user_id: '3',
  description: '',
  tags: [],
  has_cached_run: false,
  directory: [
    {
      name: 'Ml.yaml',
      content: validConfig
    }
  ]
};

let labWithInvalidConfig: Lab = {
  id: 'some-lab',
  name: 'Some Lab',
  user_id: '3',
  description: '',
  tags: [],
  has_cached_run: false,
  directory: [
    {
      name: 'Ml.yaml',
      content: invalidConfig
    }
  ]
};

let labWithoutConfig: Lab = {
  id: 'some-lab',
  name: 'Some Lab',
  user_id: '3',
  description: '',
  tags: [],
  has_cached_run: false,
  directory: []
};

let svc: LabConfigService;

beforeEach(() => {
  svc = new LabConfigService();
});

describe('.readConfig(lab)', () => {
  it('should return parsed PublicLabConfiguration', () => {
    let config: PublicLabConfiguration = svc.readConfig(lab);
    expect(config.dockerImageId).toBe(dockerImageId);
  });

  it('should return parsed PublicLabConfiguration no matter file name casing', () => {
    let config: PublicLabConfiguration = svc.readConfig(labWithPascalCase);
    expect(config.dockerImageId).toBe(dockerImageId);
  });

  it('should return null for invalid configs', () => {
    let config: PublicLabConfiguration = svc.readConfig(labWithInvalidConfig);
    expect(config).toBeNull();
  });

  it('should return null if config does not exist', () => {
    let config: PublicLabConfiguration = svc.readConfig(labWithoutConfig);
    expect(config).toBeNull();
  });
});
