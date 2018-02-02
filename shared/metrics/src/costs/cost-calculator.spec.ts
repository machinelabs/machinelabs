import 'jest';

import { CostCalculator } from './cost-calculator';
import { Execution, HardwareType } from '@machinelabs/models';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { CostReport } from './cost-report';
import { COST_PER_SECOND_PER_TYPE } from './costs';


let mToMs = (m: number) => m * 60 * 1000;
let mToS = (m: number) => m * 60;


let generateExecutions = () => <Array<Execution>>[
  {
    hardware_type: HardwareType.CPU,
    started_at: Date.now() - mToMs(20),
    finished_at: Date.now() - mToMs(10),
  },
  {
    hardware_type: HardwareType.CPU,
    started_at: Date.now() - mToMs(30),
    finished_at: Date.now() - mToMs(15),
  },
  {
    hardware_type: HardwareType.CPU,
    started_at: Date.now() - mToMs(25),
    // This simulates an execution that is still running
    finished_at: null,
  },
  {
    hardware_type: HardwareType.GPU,
    started_at: Date.now() - mToMs(20),
    finished_at: Date.now() - mToMs(10),
  },
  {
    hardware_type: HardwareType.GPU,
    started_at: Date.now() - mToMs(30),
    finished_at: Date.now() - mToMs(15),
  }
];

describe('.calc()', () => {
  it('should calculate CostReport', (done) => {
    expect.assertions(6);

    let executions$ = from(generateExecutions());

    let calculator = new CostCalculator();

    let expectedDurationEconomy = mToS(50);
    let expectedDurationPremium = mToS(25);
    let expectedCostEconomy = +(expectedDurationEconomy * COST_PER_SECOND_PER_TYPE.get(HardwareType.CPU)).toFixed(2);
    let expectedCostPremium = +(expectedDurationPremium * COST_PER_SECOND_PER_TYPE.get(HardwareType.GPU)).toFixed(2);

    let expectedTotalDuration = expectedDurationEconomy + expectedDurationPremium;

    calculator.calc(executions$)
              .subscribe(statistic => {
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
