import {Component, Output, Input, EventEmitter} from '@angular/core';
import {LabExecutionContext} from '../../lab';
import {LabBrowserAction} from '../actions/actions';
import {
  shareLabAction, embedLabAction,
  hideNavigator, showNavigator
} from '../actions/browser-actions';

@Component({
  selector: 'ml-lab-footer',
  styles : [
    `.ml-footer { 
        height : 48px; 
        width : 100%;
        border : rgba(137, 170, 251, 0.27) 1px solid; 
        padding : 4px;
        font-size : 0.8em;
    }`,
    `.elevated {
        background-color: #2196f3;
        color : white;
        line-height: 12px;
        height: 22px;
        vertical-align: middle;
        margin: 10px;
        min-width : 60px;
    }`, `
    .mat-slide-toggle {
      height: 20px;
      line-height: 24px;
      margin-left: 20px;      
    }
    `
  ],
  template: `
    <div class="ml-footer">
      <div fxLayout="row" fxLayoutAlign="space-between center" >
         <md-slide-toggle (click)="toggleProject()"> FileList  </md-slide-toggle>
        <div class="statusArea"></div>
        <div>
          <button md-button md-raised-button md-primary class="elevated"
                (click)="share()">Share</button>
          <button md-button md-raised-button md-primary class="elevated" 
                (click)="embed()">Embed</button>
        </div>
      </div>
    </div>
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
