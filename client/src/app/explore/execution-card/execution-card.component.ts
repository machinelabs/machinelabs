import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ExecutionStatus, Execution } from '../../models/execution';

@Component({
  selector: 'ml-execution-card',
  templateUrl: './execution-card.component.html',
  styleUrls: ['./execution-card.component.scss']
})
export class ExecutionCardComponent {

  @Input() execution;

  @Output() view = new EventEmitter<Execution>();

  ExecutionStatus = ExecutionStatus;
}
