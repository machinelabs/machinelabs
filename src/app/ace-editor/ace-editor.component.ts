import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef
} from '@angular/core';

declare var ace: any;

const ACE_EDITOR_THEME = 'ace/theme/github';
const ACE_EDITOR_MODE = 'ace/mode/python';

@Component({
  selector: 'ml-ace-editor',
  template: `
    <div #editor><ng-content></ng-content></div>
  `,
  styleUrls: ['./ace-editor.component.scss']
})
export class AceEditorComponent implements AfterViewInit {

  private editor;

  @ViewChild('editor') editorElement: ElementRef;

  @Input() value = null;

  @Output() valueChange = new EventEmitter();

  ngOnChanges(changes) {
    // we need to check if editor is defined because ngOnChanges
    // runs before ngAfterViewInit(). Is there a better way?
    if (this.editor !== undefined) {
      if (changes.value) {
        this.editor.setValue(this.value, 1);
      }
    }
  }

  ngAfterViewInit() {
    this.editor = ace.edit(this.editorElement.nativeElement);
    this.editor.setTheme(ACE_EDITOR_THEME);
    this.editor.getSession().setMode(ACE_EDITOR_MODE);

    // if content children are used `value` might be null
    if (this.value !== null) {
      this.editor.setValue(this.value);
    }
    this.editor.gotoLine(1);

    this.editor.getSession().on('change', (e) => {
      this.valueChange.emit(this.editor.getValue());
    });
  }
}
