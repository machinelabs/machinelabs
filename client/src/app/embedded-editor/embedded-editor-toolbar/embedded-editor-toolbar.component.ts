import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Lab } from '../../models/lab';

@Component({
  selector: 'ml-embedded-editor-toolbar',
  templateUrl: './embedded-editor-toolbar.component.html',
  styleUrls: ['./embedded-editor-toolbar.component.scss']
})
export class EmbeddedEditorToolbarComponent {

  @Input() lab: Lab;

  @Output() replay = new EventEmitter<Lab>();

  @Output() open = new EventEmitter<void>();

}
