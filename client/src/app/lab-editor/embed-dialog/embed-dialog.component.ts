import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LocationHelper } from '../../util/location-helper';

@Component({
  selector: 'ml-embed-dialog',
  templateUrl: './embed-dialog.component.html',
  styles: [
    `
      textarea {
        width: 100%;
        height: 175px;
        font-size: 0.9em;
        border: 1px solid #ccc;
      }
      p {
        text-align: center;
      }
    `
  ]
})
export class EmbedDialogComponent implements OnInit {
  embedUrl: string;

  editorUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private locationHelper: LocationHelper) {}

  ngOnInit() {
    this.embedUrl = this.locationHelper.prepareExternalUrl(
      ['/embedded', this.data.lab.id, this.data.executionId],
      true
    );
    this.editorUrl = this.locationHelper.prepareExternalUrl(['/editor', this.data.lab.id, this.data.executionId], true);
  }
}
