import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Execution } from '../../models/execution';

@Component({
  selector: 'ml-execution-metadata',
  templateUrl: './execution-metadata.component.html',
  styleUrls: ['./execution-metadata.component.scss']
})
export class ExecutionMetadataComponent {
  @Input() execution = null as Execution;
  @Input() executer: User;
}
