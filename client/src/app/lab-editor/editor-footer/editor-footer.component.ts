import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { EmbedDialogComponent } from '../embed-dialog/embed-dialog.component';
import { Execution } from '../../models/execution';
import { Lab } from '../../models/lab';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ml-footer',
  templateUrl: './editor-footer.component.html',
  styleUrls: ['./editor-footer.component.scss']
})
export class FooterComponent {

  @Input() lab: Lab;

  @Input() execution = null as Observable<Execution>;

  @Input() executionId: string;

  @Input() slideToggleChecked: boolean;

  @Output() slideToggleClick = new EventEmitter<void>();

  shareDialogRef: MatDialogRef<ShareDialogComponent>;

  embedDialogRef: MatDialogRef<EmbedDialogComponent>;

  constructor(private dialog: MatDialog) { }

  openShareDialog() {
    this.shareDialogRef = this.dialog.open(ShareDialogComponent);
  }

  openEmbedDialog() {
    this.embedDialogRef = this.dialog.open(EmbedDialogComponent, {
      data: {
        lab: this.lab,
        executionId: this.executionId
      }
    });
  }

}
