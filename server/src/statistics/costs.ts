import { HardwareType } from '../models/server';

export const COST_PER_SECOND_PER_TYPE = new Map<HardwareType, number>();
COST_PER_SECOND_PER_TYPE.set(HardwareType.Economy, 0.000012);
COST_PER_SECOND_PER_TYPE.set(HardwareType.Premium, 0.00012);

