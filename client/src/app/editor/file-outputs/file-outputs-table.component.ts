import { Component, Input, Output, EventEmitter } from '@angular/core';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { OutputFile } from '../../models/output-file';
import { isImage } from '../../util/output';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ml-file-outputs-table',
  templateUrl: './file-outputs-table.component.html',
  styleUrls: ['./file-outputs-table.component.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* <=> *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger(100, [style({ opacity: 0 }), animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1 }))]),
          { optional: true }
        )
      ])
    ])
  ]
})
export class FileOutputsTableComponent {
  @Input() outputFiles: Array<OutputFile>;

  @Output() copyDone = new EventEmitter<string>();
  @Output() preview = new EventEmitter<OutputFile>();

  displayedColumns = ['name', 'created', 'size', 'contentType', 'actions'];
  isImage = isImage;

  getApiLink(outputFile: OutputFile) {
    return `${environment.restApiURL}/executions/${outputFile.execution_id}/outputs/${outputFile.name}`;
  }
}
