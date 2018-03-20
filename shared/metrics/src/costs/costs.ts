import { HardwareType } from '@machinelabs/models';

export const COST_PER_SECOND_PER_TYPE = new Map<HardwareType, number>();
COST_PER_SECOND_PER_TYPE.set(HardwareType.CPU, 0.000012);
COST_PER_SECOND_PER_TYPE.set(HardwareType.GPU, 0.00012);
