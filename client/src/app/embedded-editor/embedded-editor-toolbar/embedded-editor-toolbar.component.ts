import { Component, Output, Input, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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

  truncateLabNameWordCount = 4;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Tablet, Breakpoints.Web]).subscribe(state => {
      this.truncateLabNameWordCount = state.matches ? 10 : 4;
    });
  }
}
