import {Component, Input} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ml-code-editor',
  template: `
    <ml-panel [panelTitle]="file.name" [fxFlex]="cols.editor">
      <ml-ace-editor #editor mode="python"
        [(value)]="file.content">
      </ml-ace-editor>
    </ml-panel>
    <ml-panel panelTitle="Output" [fxFlex]="cols.output">
      <ml-ace-editor readOnly="true" showGutter="false"
        [value]="output | async">
      </ml-ace-editor>
    </ml-panel>
  `,
  styles : [
  ' :host { display: flex; height: 100% } '
  ]
})
export class CodeEditorComponent {
  @Input() file : File;
  @Input() output: Observable<string>;

  protected cols  = {
    editor : 50,
    output : 50
  };
}
