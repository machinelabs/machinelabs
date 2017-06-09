import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { Execution } from '../../models/execution';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ml-footer',
  templateUrl: './editor-footer.component.html',
  styleUrls: ['./editor-footer.component.scss']
})
export class FooterComponent {

  @Input() execution = null as Observable<Execution>;

  @Input() slideToggleChecked: boolean;

  @Output() slideToggleClick = new EventEmitter<void>();

  shareDialogRef: MdDialogRef<ShareDialogComponent>;

  constructor(private dialog: MdDialog) { }

  openShareDialog() {
    this.shareDialogRef = this.dialog.open(ShareDialogComponent);
  }

}
