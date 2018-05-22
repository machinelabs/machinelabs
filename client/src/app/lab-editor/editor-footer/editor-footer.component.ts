import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EmbedDialogComponent } from '../embed-dialog/embed-dialog.component';
import { Execution } from '../../models/execution';
import { Lab } from '../../models/lab';
import { Observable } from 'rxjs';

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

  embedDialogRef: MatDialogRef<EmbedDialogComponent>;

  constructor(private dialog: MatDialog) {}

  openEmbedDialog() {
    this.embedDialogRef = this.dialog.open(EmbedDialogComponent, {
      data: {
        lab: this.lab,
        executionId: this.executionId
      }
    });
  }
}
