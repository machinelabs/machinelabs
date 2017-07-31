import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
import { MdDialogModule } from '@angular/material';

import { LAB_STUB } from '../../../test-helper/stubs/lab.stubs';

import { EditorService } from '../editor.service';
import { File } from '../../models/lab';
import { FileTreeComponent } from './file-tree.component';
import { FileNameDialogComponent } from '../file-name-dialog/file-name-dialog.component';

const editorServiceStub = {
  lab: Object.assign({}, LAB_STUB),
  openFile: (file: File) => {}
};

describe('FileTreeComponent', () => {

  describe('Integration tests', () => {

    let fixture: ComponentFixture<FileTreeComponent>;
    let component: FileTreeComponent;
    let editorService: EditorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MdDialogModule],
        declarations: [
          FileTreeComponent
        ],
        providers: [
          { provide: EditorService, useValue: editorServiceStub }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });

      fixture = TestBed.createComponent(FileTreeComponent);
      component = fixture.componentInstance;
      editorService = TestBed.get(EditorService);
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

    describe('.deleteFile()', () => {

      it('should delete given file', () => {
        expect(component.files).toEqual(editorService.lab.directory);
        component.deleteFile(editorService.lab.directory[1]);
        expect(component.files).toEqual([editorService.lab.directory[0]]);
      });
    });

    describe('.updateFile()', () => {

      it('should update file', () => {
        let updateFile = {
          name: 'update.py',
          content: ''
        }
        component.updateFile(editorService.lab.directory[0], updateFile);
        expect(editorService.lab.directory[0]).toEqual(updateFile);
      });
    });
  });

  describe('Shallow tests', () => {

    let fixture: ComponentFixture<FileTreeComponent>;
    let component: FileTreeComponent;
    let editorService: EditorService;

    let testFiles: File[] = [
      { name: 'main.py', content: 'Hello world!' },
      { name: 'second.py', content: 'Second file' },
      { name: 'third.py', content: 'Third file' }
    ];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MdDialogModule],
        providers: [
          { provide: EditorService, useValue: editorServiceStub }
        ],
        declarations: [FileTreeComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      fixture = TestBed.createComponent(FileTreeComponent);
      component = fixture.componentInstance;
      editorService = TestBed.get(EditorService);

      editorService.lab.directory = testFiles;
      fixture.detectChanges();
    });

    it('should render list of files', () => {
      let items = fixture.debugElement.queryAll(By.css('li'));
      expect(items.length).toEqual(3);
      expect(items[0].nativeElement.textContent).toContain('main.py');
      expect(items[1].nativeElement.textContent).toContain('second.py');
      expect(items[2].nativeElement.textContent).toContain('third.py');
    });

    it('should select file when list item is clicked', () => {
      spyOn(editorService, 'openFile');

      let items = fixture.debugElement.queryAll(By.css('.ml-file-list-item'));

      items[0].triggerEventHandler('click', { target: { nodeName: 'LI' }});
      expect(editorService.openFile).toHaveBeenCalledWith(testFiles[0])

      items[1].triggerEventHandler('click', { target: { nodeName: 'LI' }});
      expect(editorService.openFile).toHaveBeenCalledWith(testFiles[1])
    });

    it('shouldn\'t select file when edit button is clicked', () => {
      let editButton = fixture.debugElement.query(By.css('.ml-file-list-item-button.edit'));
      let deleteButton = fixture.debugElement.query(By.css('.ml-file-list-item-button.delete'));

      spyOn(editorService, 'openFile');

      editButton.triggerEventHandler('click', null);
      expect(editorService.openFile).not.toHaveBeenCalled();
    });

    it('should open filename dialog to add files', () => {
      let addButton = fixture.debugElement.query(By.css('.ml-file-tree-cta'));

      spyOn(component.dialog, 'open');

      addButton.triggerEventHandler('click', null);
      expect(component.dialog.open).toHaveBeenCalledWith(
        FileNameDialogComponent,
        {
          disableClose: false,
          data: { fileName: '' }
        }
      );
    });

    it('should open filename dialog to edit files', () => {
      let editButton = fixture.debugElement.query(By.css('.ml-file-list-item-button.edit'));

      let fileToEdit = {
        name: 'main.py',
        content: ''
      };

      spyOn(component.dialog, 'open');

      editButton.triggerEventHandler('click', fileToEdit);
      expect(component.dialog.open).toHaveBeenCalledWith(
        FileNameDialogComponent,
        {
          disableClose: false,
          data: { fileName: fileToEdit.name }
        }
      );
    });

    it('should not render action buttons if configured that way', () => {
      component.showActionButtons = false;
      fixture.detectChanges();

      let addButton = fixture.debugElement.query(By.css('.ml-file-tree-cta'));
      let editButton = fixture.debugElement.query(By.css('.ml-file-list-item-button.edit'));
      let deleteButton = fixture.debugElement.query(By.css('.ml-file-list-item-button.delete'));

      expect(addButton).toBe(null);
      expect(editButton).toBe(null);
      expect(deleteButton).toBe(null);
    });
  });
});
