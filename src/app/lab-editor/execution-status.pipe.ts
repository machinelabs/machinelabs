import { Pipe, PipeTransform } from '@angular/core';
import { ExecutionStatus } from '../models/execution';

const executionStatusLabelMap = new Map();

executionStatusLabelMap.set(ExecutionStatus.Pristine, 'Not executed');
executionStatusLabelMap.set(ExecutionStatus.Executing, 'Executing...');
executionStatusLabelMap.set(ExecutionStatus.Finished, 'Finished');
executionStatusLabelMap.set(ExecutionStatus.Stopped, 'Stopped');
executionStatusLabelMap.set(ExecutionStatus.Failed, 'Failed');

@Pipe({
  name: 'executionStatusLabel'
})
export class ExecutionStatusPipe implements PipeTransform {
  transform(executionStatus: number): string {
    return executionStatusLabelMap.get(executionStatus);
  }
}
