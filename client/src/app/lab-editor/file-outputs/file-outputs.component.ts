import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { OutputFilesService } from '../../output-files.service';
import { OutputFile } from '../../models/output-file';

import 'rxjs/add/operator/scan';

@Component({
  selector: 'ml-file-outputs',
  templateUrl: './file-outputs.component.html',
  styleUrls: ['./file-outputs.component.scss']
})
export class FileOutputsComponent implements OnChanges {

  @Input() executionId: string;

  displayedColumns = ['name', 'created', 'size', 'contentType', 'actions'];

  dataSource: OutputFilesDataSource;

  hasOutput: Observable<boolean>;

  constructor(private outputFilesService: OutputFilesService) {}

  ngOnChanges() {
    this.dataSource = new OutputFilesDataSource(this.outputFilesService, this.executionId);
    this.hasOutput = this.outputFilesService.hasOutputFiles(this.executionId);
  }
}

export class OutputFilesDataSource extends DataSource<any> {

  constructor(private outputFilesService: OutputFilesService, private executionId: string) {
    super();
  }

  connect(): Observable<OutputFile[]> {
    return this.outputFilesService
        .observeOutputFilesFromExecution(this.executionId)
        .scan((acc, val) => [val, ...acc], []);
  }

  disconnect() {}
}

