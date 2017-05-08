import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { WindowRef } from '../../window-ref.service';

@Component({
  selector: 'ml-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent {

  get href(): string {
    return this.windowRef.nativeWindow.location.href;
  }

  constructor(
    private dialogRef: MdDialogRef<ShareDialogComponent>,
    private windowRef: WindowRef
  ) {}
}
