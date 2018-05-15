import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { filter, mergeMap, scan, take } from 'rxjs/operators';

import { OutputFilesService } from '../../output-files.service';
import { OutputFile } from '../../models/output-file';
import { FilePreviewDialogService } from '../file-preview/file-preview-dialog.service';
import { LocationHelper } from '../../util/location-helper';
import { isImage } from '../../util/output';
import { SnackbarService } from '../../snackbar.service';

import { environment } from '../../../environments/environment';

export class OutputFilesDataSource extends DataSource<any> {
  constructor(private outputFilesService: OutputFilesService, private executionId: string) {
    super();
  }

  connect(): Observable<OutputFile[]> {
    return this.outputFilesService
      .observeOutputFilesFromExecution(this.executionId)
      .pipe(scan((acc: OutputFile[], val: OutputFile) => [val, ...acc], []));
  }

  disconnect() {}
}

@Component({
  selector: 'ml-file-outputs',
  templateUrl: './file-outputs.component.html',
  styleUrls: ['./file-outputs.component.scss']
})
export class FileOutputsComponent implements OnChanges, OnInit {
  @Input() executionId: string;

  displayedColumns = ['name', 'created', 'size', 'contentType', 'actions'];

  dataSource: OutputFilesDataSource;

  hasOutput: Observable<boolean>;

  isImage = isImage;

  constructor(
    public outputFilesService: OutputFilesService,
    private snackbarService: SnackbarService,
    private filePreviewService: FilePreviewDialogService,
    private route: ActivatedRoute,
    private locationHelper: LocationHelper,
    private location: Location
  ) {}

  ngOnInit() {
    const outputFileId = this.route.snapshot.queryParamMap.get('preview');

    if (outputFileId) {
      this.hasOutput
        .pipe(
          filter(hasOutput => hasOutput),
          mergeMap(() => this.dataSource.connect()),
          mergeMap(outputFiles => outputFiles),
          filter(outputFile => outputFile.id === outputFileId),
          filter(outputFile => isImage(outputFile.name)),
          take(1)
        )
        .subscribe(outputFile => this.openPreview(outputFile));
    }
  }

  ngOnChanges() {
    this.dataSource = new OutputFilesDataSource(this.outputFilesService, this.executionId);
    this.hasOutput = this.outputFilesService.hasOutputFiles(this.executionId);
  }

  openPreview(outputFile: OutputFile) {
    this.locationHelper.updateQueryParams(this.location.path(), {
      preview: outputFile.id
    });

    this.filePreviewService
      .open({
        data: {
          outputFile
        }
      })
      .beforeClose()
      .subscribe(() => {
        this.locationHelper.removeQueryParams(this.location.path(), 'preview');
      });
  }

  getApiLink(outputFile: OutputFile) {
    return `${environment.restApiURL}/executions/${outputFile.execution_id}/outputs/${outputFile.name}`;
  }

  copyDone(error = false) {
    const message = error ? 'Could not copy link' : 'Link copied';
    this.snackbarService.notify(message);
  }
}
