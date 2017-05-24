import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  OnChanges
} from '@angular/core';

declare var ace: any;


const ACE_EDITOR_THEME_PREFIX = 'ace/theme/';
const ACE_EDITOR_THEME_DEFAULT = `${ACE_EDITOR_THEME_PREFIX}github`;
const ACE_EDITOR_MODE_PREFIX = 'ace/mode/';

@Component({
  selector: 'ml-ace-editor',
  template: `
    <div class="ml-ace-editor__mount" #editor><ng-content></ng-content></div>
  `,
  styleUrls: ['./ace-editor.component.scss']
})
export class AceEditorComponent implements AfterViewInit, OnChanges {

  private editor;
  private _mode;
  private _theme;

  @ViewChild('editor') editorElement: ElementRef;

  @Input() value = null;

  @Input() readOnly = false;

  @Input() showGutter = true;

  @Input() hlActiveLine = false;

  @Input() showPrintMargin = false;

  @Input() set theme(value) {
    this._theme = ACE_EDITOR_THEME_PREFIX + value;
  }

  get theme() {
    return this._theme;
  }

  @Input() set mode(value) {
    this._mode = ACE_EDITOR_MODE_PREFIX + value;
  }

  get mode() {
    return this._mode;
  }

  @Output() valueChange = new EventEmitter();

  ngOnChanges(changes) {
    // we need to check if editor is defined because ngOnChanges
    // runs before ngAfterViewInit(). Is there a better way?
    if (this.editor !== undefined) {
      if (changes.value
          && this.value !== null
          && this.value !== this.editor.getValue()) {
        this.editor.setValue(this.value, 1);
      }

      if (changes.readOnly) {
        this.editor.setReadOnly(this.readOnly);
      }

      if (changes.mode) {
        this.editor.getSession().setMode(this.mode);
      }

      if (changes.theme) {
        this.editor.setTheme(this.theme);
      }

      if (changes.showPrintMargin) {
        this.editor.setShowPrintMargin(this.showPrintMargin);
      }

      if (changes.hlActiveLine) {
        this.editor.setHighlightActiveLine(this.hlActiveLine);
      }
    }
  }

  ngAfterViewInit() {
    this.editor = ace.edit(this.editorElement.nativeElement);

    this.editor.setTheme(this.theme);
    this.editor.setReadOnly(this.readOnly);
    this.editor.setHighlightActiveLine(this.hlActiveLine);
    this.editor.setShowPrintMargin(this.showPrintMargin);

    this.editor.getSession().setMode(this.mode);
    this.editor.renderer.setShowGutter(this.showGutter);

    // if content children are used `value` might be null
    if (this.value !== null) {
      this.editor.setValue(this.value);
    }

    this.editor.gotoLine(1);

    this.editor.getSession().on('change', (e) => {
      this.valueChange.emit(this.editor.getValue());
    });
  }

  clear() {
    if (this.editor) {
      this.editor.setValue('');
    }
  }
}
