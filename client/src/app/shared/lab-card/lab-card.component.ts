import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Lab } from '../../models/lab';
import { User } from '../../models/user';
import { Execution } from '../../models/execution';

@Component({
  selector: 'ml-lab-card',
  templateUrl: './lab-card.component.html',
  styleUrls: ['./lab-card.component.scss']
})
export class LabCardComponent {
  @Input() lab: Lab;
  @Input() user: User;
  @Input() executions: Array<{ id: string; execution: Observable<Execution> }>;
  @Input() showDescription = false;
  @Input() showUsername = true;
  @Input() showTags = false;

  trackExecutionById(index, execution) {
    return execution.id;
  }
}
