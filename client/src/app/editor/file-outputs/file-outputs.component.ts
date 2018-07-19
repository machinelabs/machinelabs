import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, ReplaySubject } from 'rxjs';

import {
  distinctUntilChanged,
  filter,
  mergeMap,
  scan,
  share,
  switchMap,
  take,
  startWith,
  auditTime
} from 'rxjs/operators';

import { OutputFile } from '../../models/output-file';
import { OutputFilesService } from '../../output-files.service';
import { SnackbarService } from '../../snackbar.service';
import { LocationHelper } from '../../util/location-helper';
import { FilePreviewDialogService } from '../file-preview/file-preview-dialog.service';
import { isImage } from '../../util/output';

@Component({
  selector: 'ml-file-outputs',
  templateUrl: './file-outputs.component.html',
  styleUrls: ['./file-outputs.component.scss']
})
export class FileOutputsComponent implements OnChanges, OnInit {
  @Input() executionId: string;

  outputFiles$: Observable<OutputFile[]>;
  observingState$: Observable<boolean>;
  executionId$ = new ReplaySubject<string>(1);

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

    this.outputFiles$ = this.executionId$.pipe(
      switchMap(() =>
        this.outputFilesService.observeOutputFilesFromExecution(this.executionId).pipe(
          scan((acc: OutputFile[], val: OutputFile) => [...acc, val], []),
          auditTime(100),
          startWith([])
        )
      ),
      distinctUntilChanged(),
      share()
    );

    this.outputFiles$
      .pipe(
        mergeMap(outputFiles => outputFiles),
        filter(outputFile => outputFile.id === outputFileId),
        filter(outputFile => isImage(outputFile.name)),
        take(1)
      )
      .subscribe(outputFile => this.openPreview(outputFile));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.executionId) {
      this.executionId$.next(this.executionId);
    }
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

  showClipboardToast(error = false) {
    const message = error ? 'Could not copy link' : 'Link copied';
    this.snackbarService.notify(message);
  }
}
