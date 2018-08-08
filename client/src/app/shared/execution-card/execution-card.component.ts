import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Execution } from '../../models/execution';
import { ExecutionStatus } from '@machinelabs/models';
import { OutputFilesService } from '../../output-files.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ml-execution-card',
  templateUrl: './execution-card.component.html',
  styleUrls: ['./execution-card.component.scss']
})
export class ExecutionCardComponent implements OnChanges {
  hasOutput$: Observable<boolean>;

  constructor(public outputFilesService: OutputFilesService) {}

  @Input() execution;

  @Output() view = new EventEmitter<Execution>();
  ExecutionStatus = ExecutionStatus;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.execution && changes.execution.currentValue !== null) {
      this.hasOutput$ = this.outputFilesService.hasOutputFiles(this.execution.id);
    }
  }
}
