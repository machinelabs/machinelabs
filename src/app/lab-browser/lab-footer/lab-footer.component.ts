import {Component, Output, Input, EventEmitter} from '@angular/core';
import {LabExecutionContext} from '../../lab';
import {LabBrowserAction} from '../actions/actions';
import {
  shareLabAction, embedLabAction,
  hideNavigator, showNavigator
} from '../actions/browser-actions';

@Component({
  selector: 'ml-lab-footer',
  template: `
    <md-toolbar color="primary">
      <div fxLayout="row" fxLayoutAlign="space-between center" >
        <button md-button (click)="toggleProject()">FileList</button>
        <div class="statusArea"></div>
        <div>
          <button md-button md-raised md-primary (click)="share()">Share</button>
          <button md-button md-raised md-primary (click)="embed()">Embed</button>
        </div>
      </div>
    </md-toolbar>
  `
})
export class LabFooterComponent {
  @Input() context: LabExecutionContext;
  @Output() action = new EventEmitter<LabBrowserAction>();

  // *****************************************************
  // Internal protected methods delegate to external
  // *****************************************************

  toggleProject() {
    this.isVisible = !this.isVisible;
    return (this.isVisible && this.hideProject()) || this.showProject();
  }

  protected share()       { this.action.emit(shareLabAction(this.context.lab)); }
  protected embed()       { this.action.emit(embedLabAction(this.context.lab)); }
  protected hideProject() { this.action.emit(hideNavigator()); }
  protected showProject() { this.action.emit(showNavigator()); }

  private isVisible = true;
}
