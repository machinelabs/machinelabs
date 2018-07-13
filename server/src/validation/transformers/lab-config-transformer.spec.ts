import 'jest';

import { LAB_CONFIG_TRANSFORMER } from './lab-config-transformer';
import { LabConfigResolver } from '../resolver/lab-config-resolver';
import { UserResolver } from '../resolver/user-resolver';
import { PlanId } from '@machinelabs/models';

describe('when invoked with empty map', () => {
  it('should not crash', () => {
    expect(() => {
      LAB_CONFIG_TRANSFORMER(new Map());
    }).not.toThrow();
  });
});

describe.only('when invoked without user', () => {
  it('should not crash', () => {
    expect(() => {
      const config = {};
      const map = new Map();
      map.set(LabConfigResolver, config);

      LAB_CONFIG_TRANSFORMER(map);

      expect(config).toEqual({});
    }).not.toThrow();
  });
});

describe.only('when invoked without plan', () => {
  it('should not crash', () => {
    expect(() => {
      const config = {};
      const map = new Map();
      map.set(LabConfigResolver, config);
      map.set(UserResolver, {});

      LAB_CONFIG_TRANSFORMER(map);

      expect(config).toEqual({ maxFileUploads: 0, maxUploadFileSizeMb: 0, maxWriteableContainerSizeInGb: 0 });
    }).not.toThrow();
  });
});

describe.only('when invoked with plan', () => {
  it('should set quotas according to plan', () => {
    expect(() => {
      const config = {};
      const map = new Map();
      map.set(LabConfigResolver, config);
      map.set(UserResolver, { plan: { plan_id: PlanId.Beta } });

      LAB_CONFIG_TRANSFORMER(map);

      expect(config).toEqual({ maxFileUploads: 5, maxUploadFileSizeMb: 20, maxWriteableContainerSizeInGb: 6 });
    }).not.toThrow();
  });
});
