import 'jest';

import { CostCalculator } from './cost-calculator';
import { Execution, HardwareType } from '@machinelabs/models';
import { Observable, from } from 'rxjs';
import { CostReport } from './cost-report';
import { COST_PER_SECOND_PER_TYPE } from './costs';

const mToMs = (m: number) => m * 60 * 1000;
const mToS = (m: number) => m * 60;

const generateExecutions = () =>
  <Array<Execution>>[
    {
      hardware_type: HardwareType.CPU,
      started_at: Date.now() - mToMs(20),
      finished_at: Date.now() - mToMs(10)
    },
    {
      hardware_type: HardwareType.CPU,
      started_at: Date.now() - mToMs(30),
      finished_at: Date.now() - mToMs(15)
    },
    {
      hardware_type: HardwareType.CPU,
      started_at: Date.now() - mToMs(25),
      // This simulates an execution that is still running
      finished_at: null
    },
    {
      hardware_type: HardwareType.GPU,
      started_at: Date.now() - mToMs(20),
      finished_at: Date.now() - mToMs(10)
    },
    {
      hardware_type: HardwareType.GPU,
      started_at: Date.now() - mToMs(30),
      finished_at: Date.now() - mToMs(15)
    }
  ];

describe('.calc()', () => {
  it('should calculate CostReport', done => {
    expect.assertions(6);

    const executions$ = from(generateExecutions());

    const calculator = new CostCalculator();

    const expectedDurationEconomy = mToS(50);
    const expectedDurationPremium = mToS(25);
    const expectedCostEconomy = +(expectedDurationEconomy * COST_PER_SECOND_PER_TYPE.get(HardwareType.CPU)).toFixed(2);
    const expectedCostPremium = +(expectedDurationPremium * COST_PER_SECOND_PER_TYPE.get(HardwareType.GPU)).toFixed(2);

    const expectedTotalDuration = expectedDurationEconomy + expectedDurationPremium;

    calculator.calc(executions$).subscribe(statistic => {
      expect(statistic.secondsPerHardware.get(HardwareType.CPU)).toBe(expectedDurationEconomy);
      expect(statistic.secondsPerHardware.get(HardwareType.GPU)).toBe(expectedDurationPremium);
      expect(statistic.costPerHardware.get(HardwareType.CPU)).toBe(expectedCostEconomy);
      expect(statistic.costPerHardware.get(HardwareType.GPU)).toBe(expectedCostPremium);
      expect(statistic.totalSeconds).toBe(expectedTotalDuration);
      expect(statistic.totalCost).toBe(expectedCostEconomy + expectedCostPremium);
      done();
    });
  });
});
