import {
  Injectable,
  Component,
  ElementRef,
  Renderer2,
  NgZone,
  OnDestroy,
  AfterContentInit
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { scan } from 'rxjs/operators';

import { MasonryComponent } from './masonry.component';

@Injectable()
export class MutationObserverFactory {
  create(callback: MutationCallback): MutationObserver | null {
    return typeof MutationObserver === 'undefined' ? null : new MutationObserver(callback);
  }
}

@Component({
  selector: 'ml-masonry-item',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MasonryItemComponent implements AfterContentInit, OnDestroy {

  private observer: MutationObserver | null;

  private mutations$ = new Subject<MutationRecord[]>();

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private masonry: MasonryComponent,
    private mutationObserverFactory: MutationObserverFactory) { }

  ngAfterContentInit() {
    this.setItemWidth();

    this.mutations$.pipe(
      scan((acc, _: any) => {
        return {
          prev: acc.curr,
          curr: this.height
        };
      }, { prev: 0, curr: 0 })
    ).subscribe(height => {
      if (height.prev !== height.curr) {
        this.masonry.pack();
      }
    });

    this.observer = this.ngZone.runOutsideAngular(() => {
      return this.mutationObserverFactory.create((mutations: MutationRecord[]) => {
        this.mutations$.next(mutations);
      });
    });

    if (this.observer) {
      this.observer.observe(this.element.nativeElement, {
        characterData: true,
        childList: true,
        subtree: true
      });
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.mutations$.complete();
  }

  private get height(): number {
    return this.element.nativeElement.offsetHeight;
  }

  private setItemWidth() {
    const { offsetWidth: parentWidth } = this.renderer.parentNode(this.masonry.hostElement);
    const itemWidth = this.calculateItemWidth(parentWidth);

    this.setWidth(itemWidth);
    this.masonry.pack();
  }

  private calculateItemWidth(containerWidth: number) {
    return (containerWidth - this.masonry.gutter * (this.masonry.columns - 1)) / this.masonry.columns;
  }

  private setWidth(width: number) {
    this.renderer.setStyle(this.element.nativeElement, 'width', `${width}px`);
  }
}
