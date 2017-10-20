import { OverlayRef, GlobalPositionStrategy } from '@angular/cdk/overlay';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter, take } from 'rxjs/operators';

import { FilePreviewDialogComponent } from './file-preview-dialog/file-preview-dialog.component';
import { OutputFile } from '../../models/output-file';


export class FilePreviewDialogRef {

  private _beforeClose = new Subject<void>();
  private _afterClosed = new Subject<void>();

  containerInstance: FilePreviewDialogComponent;

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.containerInstance.animationStateChanged.pipe(
      filter(event => event.phaseName === 'start'),
      take(1)
    ).subscribe(() => {
      this._beforeClose.next();
      this._beforeClose.complete();
      this.overlayRef.detachBackdrop();
    });

    this.containerInstance.animationStateChanged.pipe(
      filter(event => event.phaseName === 'done' && event.toState === 'leave'),
      take(1)
    ).subscribe(() => {
      this.overlayRef.dispose();
      this._afterClosed.next();
      this._afterClosed.complete();
      this.containerInstance = null!;
    });

    this.containerInstance.startExitAnimation();
  }

  afterClosed(): Observable<void> {
    return this._afterClosed.asObservable();
  }

  beforeClose(): Observable<void> {
    return this._beforeClose.asObservable();
  }

  backdropClick(): Observable<void> {
    return this.overlayRef.backdropClick();
  }
}
