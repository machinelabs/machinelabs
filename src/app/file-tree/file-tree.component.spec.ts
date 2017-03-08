import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';

import { File } from '../models/lab';
import { FileTreeComponent } from './file-tree.component';

describe('FileTreeComponent', () => {

  describe('Isolated tests', () => {

    let component: FileTreeComponent;

    beforeEach(() => {
      component = new FileTreeComponent();
    });

    describe('.isRemovable()', () => {

      it('should be true when file isn\'t \'main.py\' or more than one file exists', () => {
        component.files = [
          { name: 'main.py', content: '' },
          { name: 'second.py', content: '' }
        ];

        expect(component.isRemovable(component.files[0])).toBe(false);
        expect(component.isRemovable(component.files[1])).toBe(true);

        // if it's the only file it's not removable either
        component.files = [{ name: 'second.py', content: '' }];
        expect(component.isRemovable(component.files[0])).toBe(false);
      });
    });
  });

  describe('Shallow tests', () => {

    let fixture: ComponentFixture<FileTreeComponent>;
    let component: FileTreeComponent;

    let testFiles: File[] = [
      { name: 'main.py', content: 'Hello world!' },
      { name: 'second.py', content: 'Second file' },
      { name: 'third.py', content: 'Third file' }
    ];

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FileTreeComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      fixture = TestBed.createComponent(FileTreeComponent);
      component = fixture.componentInstance;

      component.files = testFiles;
      fixture.detectChanges();
    });

    it('should render list of files', () => {
      let items = fixture.debugElement.queryAll(By.css('md-list-item'));
      expect(items.length).toEqual(3);
      expect(items[0].nativeElement.textContent).toContain('main.py');
      expect(items[1].nativeElement.textContent).toContain('second.py');
      expect(items[2].nativeElement.textContent).toContain('third.py');
    });

    describe('Event emitters', () => {

      it('should emit selectFile event when list item is clicked', () => {
        let items = fixture.debugElement.queryAll(By.css('md-list-item'));

        let subscription = component.selectFile.subscribe((file) => {
          expect(file).toBeDefined();
          expect(file).toEqual(testFiles[0]);
        });

        items[0].triggerEventHandler('click', null);
        subscription.unsubscribe();

        subscription = component.selectFile.subscribe((file) => {
          expect(file).toBeDefined();
          expect(file).toEqual(testFiles[1]);
        });

        items[1].triggerEventHandler('click', null);
        subscription.unsubscribe();
      });

      it('should emit removeFile event when remove button is clicked', () => {
        let items = fixture.debugElement.queryAll(By.css('md-list-item button'));

        // `main.py` isn't removable, hence only two items expected
        expect(items.length).toBe(2);

        let subscription = component.removeFile.subscribe((file) => {
          expect(file).toBeDefined();
          expect(file).toEqual(testFiles[1]);
        });

        items[0].triggerEventHandler('click', null);
        subscription.unsubscribe();

        subscription = component.removeFile.subscribe((file) => {
          expect(file).toBeDefined();
          expect(file).toEqual(testFiles[2]);
        });

        items[1].triggerEventHandler('click', null);
        subscription.unsubscribe();
      });

      it('should emit addFile event when add button is clicked', () => {
        let item = fixture.debugElement.query(By.css('md-nav-list + button'));
        let emitted = false;

        component.addFile.subscribe(() => {
          emitted = true;
        });

        item.triggerEventHandler('click', null);
        expect(emitted).toBe(true);
      });
    });
  });

  describe('Test component tests', () => {

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, FileTreeComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;

      component.files = [
        { name: 'main.py', content: 'Hello world!' },
        { name: 'second.py', content: 'Second file' },
        { name: 'third.py', content: 'Third file' }
      ];

      fixture.detectChanges();

    });

    afterEach(() => {
      component.resetLog();
    });

    it('should render list of items', () => {
      let items = fixture.debugElement.queryAll(By.css('md-list-item'));
      expect(items.length).toEqual(3);
      expect(items[0].nativeElement.textContent).toContain('main.py');
      expect(items[1].nativeElement.textContent).toContain('second.py');
      expect(items[2].nativeElement.textContent).toContain('third.py');
    });

    it('should select file', () => {
      let items = fixture.debugElement.queryAll(By.css('md-list-item'));

      items[0].triggerEventHandler('click', null);
      expect(component.logs).toEqual([
        { type: 'select', message: component.files[0].name }
      ]);
    });

    it('should remove file', () => {
      let items = fixture.debugElement.queryAll(By.css('md-list-item button'));

      items[0].triggerEventHandler('click', null);
      expect(component.files.length).toEqual(2);
      expect(component.logs).toEqual([
        { type: 'remove', message: 'second.py' }
      ]);
    });

    it('should add file', () => {
      let item = fixture.debugElement.query(By.css('md-nav-list + button'));
      item.triggerEventHandler('click', null);

      expect(component.files.length).toEqual(4);
      expect(component.logs).toEqual([
        { type: 'add', message: 'new.py' }
      ]);
    });

  });
});

@Component({
  template: `
    <ml-file-tree
      [files]="files"
      (selectFile)="select($event)"
      (removeFile)="remove($event)"
      (addFile)="add()"></ml-file-tree>
  `
})
class TestComponent {

  @Input() files: File[];

  logs = [];

  select(file: File) {
    this.log('select', file);
  }

  remove(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
    this.log('remove', file);
  }

  add() {
    let file = { name: 'new.py', content: 'new file' };
    this.files.push(file);
    this.log('add', file);
  }

  resetLog() {
    this.logs = [];
  }

  private log(type:string, file: File) {
    this.logs.push({ type, message: file.name })
  }
}
