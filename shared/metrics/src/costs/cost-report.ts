import { HardwareType } from '@machinelabs/models';

export class CostReport {
  secondsPerHardware = new Map<HardwareType, number>();
  costPerHardware = new Map<HardwareType, number>();
  totalCost = 0;
  totalSeconds = 0;

  constructor() {
    this.secondsPerHardware.set(HardwareType.CPU, 0);
    this.secondsPerHardware.set(HardwareType.GPU, 0);
  }

  getSecondsPerHardware(hardwareType: HardwareType) {
    return this.secondsPerHardware.get(hardwareType) || 0;
  }

  getCostPerHardware(hardwareType: HardwareType) {
    return this.costPerHardware.get(hardwareType) || 0;
  }
}
