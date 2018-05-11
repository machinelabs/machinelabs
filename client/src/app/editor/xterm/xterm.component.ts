import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs';

declare const Terminal: any;

@Component({
  selector: 'ml-xterm',
  template: '<ng-content></ng-content>',
  styleUrls: ['./xterm.component.scss']
})
export class XtermComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges, OnDestroy {
  private term;

  private messagesSubscription = null;

  private consumedMessages: Observable<string> = null;

  @Input() messages: Observable<string> = null;

  @Input() cursorBlink = false;

  @Input() scrollback = 1000;

  private _enabled = false;

  @Input()
  set enabled(val) {
    this._enabled = val;

    if (this.messages !== this.consumedMessages) {
      this.consumeMessages();
    }
  }
  get enabled() {
    return this._enabled;
  }

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.term = new Terminal();
  }

  ngOnChanges(changes) {
    if (this.term) {
      if (changes.messages) {
        this.consumeMessages();
      }

      if (changes.cursorBlink) {
        this.setOption('cursorBlink', this.cursorBlink);
      }

      if (changes.scrollback) {
        this.setOption('scrollback', this.scrollback);
      }
    }
  }

  private consumeMessages() {
    if (!this.enabled || !this.messages) {
      return;
    }

    if (this.messagesSubscription !== null) {
      this.messagesSubscription.unsubscribe();
      this.clear();
    }
    this.consumedMessages = this.messages;
    this.messagesSubscription = this.messages.subscribe(val => this.write(val));
  }

  ngAfterViewInit() {
    this.term.open(this.element.nativeElement, true);

    if (!this.messagesSubscription) {
      this.consumeMessages();
    }

    this.setOption('scrollback', this.scrollback);
    this.setOption('cursorBlink', this.cursorBlink);
  }

  ngAfterViewChecked() {
    // Terminal.fit() lets xterm figure out how many rows and columns are
    // used for the terminal. Theoretically we could call this inside
    // ngAfterViewInit() but it seems like that's too early, even if we
    // force it to run in the next tick.
    this.term.fit();
  }

  clear() {
    if (this.term) {
      this.term.clear();
    }
  }

  reset() {
    if (this.term) {
      this.term.reset();
    }
  }

  write(value: string) {
    this.term.write(value);
  }

  resize(x?: number, y?: number) {
    this.term.resize(x, y);
  }

  scrollToBottom() {
    this.term.scrollToBottom();
  }

  setOption(name, value) {
    this.term.setOption(name, value);
  }

  ngOnDestroy() {
    this.term.destroy();
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
}
