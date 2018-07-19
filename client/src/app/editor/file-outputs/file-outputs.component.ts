import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { merge, Observable, of, Subject } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  scan,
  share,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { OutputFile } from '../../models/output-file';
import { OutputFilesService } from '../../output-files.service';
import { SnackbarService } from '../../snackbar.service';
import { LocationHelper } from '../../util/location-helper';
import { isImage } from '../../util/output';
import { FilePreviewDialogService } from '../file-preview/file-preview-dialog.service';

export class OutputFilesDataSource extends DataSource<any> {
  constructor(private outputFilesService: OutputFilesService, private executionId: string) {
    super();
  }

  connect(): Observable<OutputFile[]> {
    return this.outputFilesService
      .observeOutputFilesFromExecution(this.executionId)
      .pipe(scan((acc: OutputFile[], val: OutputFile) => [val, ...acc], []), share());
  }

  disconnect() {}
}
@Component({
  selector: 'ml-file-outputs',
  templateUrl: './file-outputs.component.html',
  styleUrls: ['./file-outputs.component.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* <=> *', [
        query('mat-row', style({ opacity: 0 }), { optional: true }),
        query(
          'mat-row',
          stagger(100, [style({ opacity: 0 }), animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1 }))]),
          { optional: true }
        )
      ])
    ])
  ]
})
export class FileOutputsComponent implements OnChanges, OnInit {
  @Input() executionId: string;

  displayedColumns = ['name', 'created', 'size', 'contentType', 'actions'];
  dataSource: OutputFilesDataSource;
  hasOutput: Observable<boolean>;
  isImage = isImage;
  loadingState$: Observable<boolean>;
  observingState$: Observable<boolean>;
  executionId$ = new Subject<string>();

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
      this.executionId = outputFileId;
    }

    const outputFiles$ = this.executionId$.pipe(
      distinctUntilChanged(),
      switchMap(() => this.outputFilesService.hasOutputFiles(this.executionId)),
      filter(hasOutput => hasOutput),
      mergeMap(() => this.dataSource.connect())
    );

    const loadingTimeout$ = of(false).pipe(delay(8000), share());
    const loading$ = outputFiles$.pipe(map(outputFiles => !!outputFiles.length), takeUntil(loadingTimeout$));

    this.loadingState$ = merge(loading$, loadingTimeout$);
    this.observingState$ = this.loadingState$.pipe(filter(loading => !loading), mapTo(true));

    outputFiles$
      .pipe(
        mergeMap(outputFiles => outputFiles),
        filter(outputFile => outputFile.id === this.executionId),
        filter(outputFile => isImage(outputFile.name)),
        take(1)
      )
      .subscribe(outputFile => this.openPreview(outputFile));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.executionId) {
      const newExecutionid = changes.executionId.currentValue ? changes.executionId.currentValue : this.executionId;
      this.executionId = newExecutionid;
      this.dataSource = new OutputFilesDataSource(this.outputFilesService, this.executionId);
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

  getApiLink(outputFile: OutputFile) {
    return `${environment.restApiURL}/executions/${outputFile.execution_id}/outputs/${outputFile.name}`;
  }

  copyDone(error = false) {
    const message = error ? 'Could not copy link' : 'Link copied';
    this.snackbarService.notify(message);
  }
}
