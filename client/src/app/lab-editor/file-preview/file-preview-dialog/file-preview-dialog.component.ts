import { Component, Inject, EventEmitter, HostListener } from '@angular/core';
import { OutputFile } from 'app/models/output-file';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { ESCAPE } from '@angular/cdk/keycodes';

import { FILE_PREVIEW_DIALOG_DATA } from '../file-preview.tokens';
import { FilePreviewDialogRef } from '../file-preview-dialog-ref';

const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
  selector: 'ml-output-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss'],
  animations: [
    trigger('fade', [
      state('fadeOut', style({ opacity: 0 })),
      state('fadeIn', style({ opacity: 1 })),
      transition('* => *', animate(ANIMATION_TIMINGS))
    ]),
    trigger('slideContent', [
      state('void', style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
      state('enter', style({ transform: 'none', opacity: 1 })),
      state('leave', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
      transition('* => *', animate(ANIMATION_TIMINGS)),
    ])
  ]
})
export class FilePreviewDialogComponent {

  loading = true;
  error = null;

  animationState: 'void' | 'enter' | 'leave' = 'enter';

  animationStateChanged = new EventEmitter<AnimationEvent>();

  @HostListener('document:keydown', ['$event']) private handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE) {
      this.dialogRef.close();
    }
  }

  constructor(
    public dialogRef: FilePreviewDialogRef,
    @Inject(FILE_PREVIEW_DIALOG_DATA) public data: any) { }

  onLoad(event: Event) {
    this.loading = false;
  }

  onError(error: ErrorEvent) {
    this.loading = false;
    this.error = true;
  }

  get outputFile(): OutputFile {
    return this.data.outputFile;
  }

  onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  startExitAnimation(): void {
    this.animationState = 'leave';
  }
}
