import { HardwareType } from '@machinelabs/core';

export class CostReport {
  secondsPerHardware = new Map<HardwareType, number>();
  costPerHardware = new Map<HardwareType, number>();
  totalCost = 0;
  totalSeconds = 0;

  constructor() {
    this.secondsPerHardware.set(HardwareType.Economy, 0);
    this.secondsPerHardware.set(HardwareType.Premium, 0);
  }
}
