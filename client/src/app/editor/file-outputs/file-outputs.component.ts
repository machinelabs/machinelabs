import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExecutionStatus, Lab } from '@machinelabs/models';

import { Observable, ReplaySubject, merge, of } from 'rxjs';

import {
  distinctUntilChanged,
  filter,
  mergeMap,
  scan,
  share,
  switchMap,
  take,
  startWith,
  auditTime,
  delay,
  mapTo,
  catchError,
  skip
} from 'rxjs/operators';

import { OutputFile } from '../../models/output-file';
import { OutputFilesService } from '../../output-files.service';
import { SnackbarService } from '../../snackbar.service';
import { LocationHelper } from '../../util/location-helper';
import { FilePreviewDialogService } from '../file-preview/file-preview-dialog.service';
import { isImage } from '../../util/output';
import { LabExecutionService } from '../../lab-execution.service';

@Component({
  selector: 'ml-file-outputs',
  templateUrl: './file-outputs.component.html',
  styleUrls: ['./file-outputs.component.scss']
})
export class FileOutputsComponent implements OnChanges, OnInit {
  @Input() executionId: string;
  @Input() lab: Lab;

  outputFiles$: Observable<OutputFile[]>;
  isLoading$: Observable<boolean>;
  executionId$ = new ReplaySubject<string>(1);

  isExecuting: boolean;

  constructor(
    public outputFilesService: OutputFilesService,
    private labExecutionService: LabExecutionService,
    private snackbarService: SnackbarService,
    private filePreviewService: FilePreviewDialogService,
    private route: ActivatedRoute,
    private locationHelper: LocationHelper,
    private location: Location
  ) {}

  ngOnInit() {
    const outputFileId = this.route.snapshot.queryParamMap.get('preview');

    const executionSelected$ = this.executionId$.pipe(
      switchMap(executionId => this.labExecutionService.executionExists(executionId).pipe(catchError(() => of(false)))),
      filter(Boolean)
    );

    const executionsAdded$ = this.labExecutionService.observeExecutionsForLab(this.lab).pipe(
      mergeMap(executions => executions),
      filter(labExecution => labExecution.id === this.executionId),
      distinctUntilChanged((a, b) => a.id === b.id),
      // We skip the first value because on page load 'executionSelected$' already emits the
      // currently selected execution we want to observe. 'executionsAdded$' should only emit
      // an execution if the user has started a new one. See comment below on the behavior of
      // 'observeExecution'.
      skip(1)
    );

    // We have to merge those two streams together because somehow, when 'observeExecution' is called
    // on an execution that was just started, it will never emit a value, although it uses ref.value()
    // under the hood. Hence, we have to observe newly added executions via 'observeExecutionsForLab'
    // which uses `child_added` internally. Both in combination allow us to switch between executions
    // but also observe new executions when once they are created in the DB.
    merge(executionSelected$, executionsAdded$)
      .pipe(switchMap(() => this.labExecutionService.observeExecution(this.executionId)))
      .subscribe(execution => {
        this.isExecuting = execution.status === ExecutionStatus.Executing;
      });

    this.isLoading$ = merge(
      this.executionId$.pipe(mapTo(true)),
      this.executionId$.pipe(
        switchMap(executionId => this.outputFilesService.hasOutputFiles(executionId)),
        // This delay is not artifically slowing down the loading of the output files but
        // rather used to avoid a flicker for the loading message and the no outputs message.
        // If output files are available before X ms, the loading message will be hidden.
        delay(1500)
      )
    );

    this.outputFiles$ = this.executionId$.pipe(
      switchMap(() =>
        this.outputFilesService.observeOutputFilesFromExecution(this.executionId).pipe(
          scan((acc: OutputFile[], val: OutputFile) => [...acc, val], []),
          // auditTime is used to 'buffer' the accumulation of the output files via scan.
          // Otherwise it will break the stagger animation because the array changes too quickly
          // and all items are animated at the same time.
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
    if (changes.executionId && changes.executionId.currentValue) {
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
