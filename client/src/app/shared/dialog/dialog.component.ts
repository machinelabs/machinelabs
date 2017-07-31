import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ml-dialog-header',
  template: `<h4 class="ml-dialog-headline"><ng-content></ng-content></h4>`,
  styleUrls: ['./dialog-header.component.scss']
})
export class DialogHeaderComponent {}

@Component({
  selector: 'ml-dialog-content',
  template: `<div class="ml-dialog-content"><ng-content></ng-content></div>`,
  styleUrls: ['./dialog-content.component.scss']
})
export class DialogContentComponent {}

@Component({
  selector: 'ml-dialog-cta-bar',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./dialog-cta-bar.component.scss']
})
export class DialogCtaBarComponent {}
