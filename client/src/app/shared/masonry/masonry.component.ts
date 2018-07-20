import { Component, OnInit, ElementRef, Input, AfterContentInit } from '@angular/core';

import Bricks from 'bricks.js';

@Component({
  selector: 'ml-masonry',
  template: '<ng-content></ng-content>',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class MasonryComponent implements OnInit, AfterContentInit {
  @Input() public columns = 3;
  @Input() public gutter = 20;

  @Input() public sizes = [{ columns: this.columns, gutter: this.gutter }];

  private instance;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.instance = new Bricks({
      container: this.element.nativeElement,
      packed: 'data-packed',
      sizes: this.sizes
    });
  }

  ngAfterContentInit() {
    this.instance.resize(true).pack();
  }

  get hostElement() {
    return this.element.nativeElement;
  }

  pack() {
    this.instance.pack();
  }

  update() {
    this.instance.update();
  }
}
