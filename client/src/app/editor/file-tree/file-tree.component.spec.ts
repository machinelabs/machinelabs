import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MdDialogModule } from '@angular/material';
import { File } from '@machinelabs/models';
import { LAB_STUB, EDITOR_SERVICE_STUB } from '../../../test-helper/stubs';
import { FileTreeComponent } from './file-tree.component';
import { EditorService } from '../editor.service';
import { FileTreeService } from './file-tree.service';
import { NameDialogService } from 'app/editor/name-dialog/name-dialog-service';

describe('FileTreeComponent', () => {

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
        { provide: EditorService, useValue: EDITOR_SERVICE_STUB },
        NameDialogService,
        FileTreeService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FileTreeComponent);
    component = fixture.componentInstance;
    editorService = TestBed.get(EditorService);
  });

  describe('.isRemovable()', () => {

    it('should not only allow removal of blacklisted files', () => {
      component.directory = { name: '', contents: [
        { name: 'main.py', content: '' },
        { name: 'second.py', content: '' }
      ]};

      component.mandatoryFiles = ['main.py'];

      expect(component.isRemovable(<File>component.directory.contents[0])).toBe(false);
      expect(component.isRemovable(<File>component.directory.contents[1])).toBe(true);

      component.mandatoryFiles = ['second.py'];

      expect(component.isRemovable(<File>component.directory.contents[0])).toBe(true);
      expect(component.isRemovable(<File>component.directory.contents[1])).toBe(false);

      component.mandatoryFiles = ['main.py', 'second.py'];

      expect(component.isRemovable(<File>component.directory.contents[0])).toBe(false);
      expect(component.isRemovable(<File>component.directory.contents[1])).toBe(false);
    });
  });

  describe('.isEditable()', () => {

    it('should not allow editing of blacklisted files', () => {
      component.directory = { name: '', contents: [
        { name: 'main.py', content: '' },
        { name: 'second.py', content: '' }
      ]};

      component.mandatoryFiles = ['main.py'];

      expect(component.isEditable(<File>component.directory.contents[0])).toBe(false);
      expect(component.isEditable(<File>component.directory.contents[1])).toBe(true);

      component.mandatoryFiles = ['second.py'];

      expect(component.isEditable(<File>component.directory.contents[0])).toBe(true);
      expect(component.isEditable(<File>component.directory.contents[1])).toBe(false);

      component.mandatoryFiles = ['main.py', 'second.py'];

      expect(component.isEditable(<File>component.directory.contents[0])).toBe(false);
      expect(component.isEditable(<File>component.directory.contents[1])).toBe(false);
    });
  });

  describe('.deleteFileOrDirectory()', () => {

    it('should delete given file from its directory', () => {
      component.directory = { name: '', contents: editorService.lab.directory };
      component.deleteFileOrDirectory(null, <File>editorService.lab.directory[1]);
      expect(component.directory.contents).toEqual([editorService.lab.directory[0]]);
    });
  });

  describe('.getFileTreePath()', () => {

    it('should generate file path based on file tree structure', () => {
      component.directory = { name: '', contents: [
        { name: 'level1', contents: [
          { name: 'level2', contents: [
            { name: 'level3', contents: [
              { name: 'foo.py', content: '' }
            ]}
          ]}
        ]}
      ]};

      fixture.detectChanges();
      let nestedList = fixture.debugElement.query(By.css('ml-file-tree ml-file-tree ml-file-tree'));
      expect(nestedList.componentInstance.getFileTreePath()).toEqual('/level1/level2/level3');
    });

    it('should generate an empty path if its the root file list', () => {
      component.directory = { name: '', contents: [
        { name: 'foo.py', content: '' }
      ]};

      fixture.detectChanges();
      expect(component.getFileTreePath()).toEqual('');
    });
  });

  it('should render list of files', () => {
    component.directory = { name: '', contents: editorService.lab.directory };
    fixture.detectChanges();
    let items = fixture.debugElement.queryAll(By.css('li'));
    expect(items.length).toEqual(2);
    expect(items[0].nativeElement.textContent).toContain('main.py');
    expect(items[1].nativeElement.textContent).toContain('ml.yaml');
  });

  it('should render a nested list of files', () => {
    component.directory = { name: '', contents: [
      { name: 'folder', contents: [
        { name: 'main.py', content: '' },
        { name: 'folder2', contents: [
          { name: 'file.py', content: '' }
        ]}
      ]}
    ]};

    fixture.detectChanges();

    let lists = fixture.debugElement.queryAll(By.css('ml-file-tree'));
    expect(lists.length).toEqual(2);

    let nestedList = lists[0].queryAll(By.css('ml-file-tree'));
    expect(nestedList).not.toBe(null);
    expect(nestedList.length).toEqual(1);
  });

  it('should not render a nested list if folder is empty', () => {
    component.directory = { name: '', contents: [
      { name: 'folder', contents: [
        { name: 'main.py', content: '' },
        { name: 'folder2', contents: [] }
      ]}
    ]};

    fixture.detectChanges();

    let lists = fixture.debugElement.queryAll(By.css('ml-file-tree'));
    expect(lists.length).toEqual(1);

    let nestedList = lists[0].queryAll(By.css('ml-file-tree'));
    expect(nestedList).not.toBe(null);
    expect(nestedList.length).toEqual(0);
  });

  it('should select file including its path if item is nested', () => {
    spyOn(editorService, 'openFile');

    let expectedFile = { name: 'foo.py', content: '' };
    let expectedPath = '/folder/folder2/foo.py';
    component.directory = { name: '', contents: [
      { name: 'folder', contents: [
        { name: 'main.py', content: '' },
        { name: 'folder2', contents: [expectedFile]}
      ]}
    ]};

    fixture.detectChanges();

    let item = fixture.debugElement.query(By.css('ml-file-tree ml-file-tree .ml-file-tree-item'));
    expect(item).not.toBe(null);

    item.triggerEventHandler('click', { target: { nodeName: 'LI' }});
    expect(editorService.openFile).toHaveBeenCalledWith(expectedFile, expectedPath);
  });

  it('should not try to select file when clicked list item represents a folder', () => {
    spyOn(editorService, 'openFile');
    component.directory = { name: '', contents: [{
      name: 'src',
      contents: [
        { name: 'foo.py', content: '' },
        { name: 'bar.py', content: '' }
      ]
    }]};
    fixture.detectChanges();
    let items = fixture.debugElement.queryAll(By.css('.ml-file-tree-item'));

    items[0].triggerEventHandler('click', { target: { nodeName: 'LI' }});
    expect(editorService.openFile).not.toHaveBeenCalled();
  });

  it('shouldn\'t select file when edit or delete button is clicked', () => {
    component.directory = { name: '', contents: [{
      name: 'src',
      contents: [
        { name: 'foo.py', content: '' },
        { name: 'bar.py', content: '' }
      ]
    }]};
    fixture.detectChanges();
    let editButton = fixture.debugElement.query(By.css('.ml-file-tree-item-button.edit'));
    let deleteButton = fixture.debugElement.query(By.css('.ml-file-tree-item-button.delete'));

    spyOn(editorService, 'openFile');

    editButton.triggerEventHandler('click', null);
    expect(editorService.openFile).not.toHaveBeenCalled();
  });

  it('shouldn\'t render edit button for files that aren\'t editable', () => {
    component.directory = { name: '', contents: [{ name: 'main.py', content: '' }] };
    component.mandatoryFiles = ['main.py'];
    fixture.detectChanges();
    let items = fixture.debugElement.queryAll(By.css('.ml-file-tree-item'));
    let editButton = items[0].queryAll(By.css('.ml-file-tree-item-button.edit'));
    expect(editButton.length).toBe(0);
  });

  it('should not render action buttons if configured that way', () => {
    component.directory = { name: '', contents: editorService.lab.directory };
    component.showActionButtons = false;
    fixture.detectChanges();
    let buttons = fixture.debugElement.queryAll(By.css('.ml-file-tree-item-button'));
    expect(buttons).toEqual([]);
  });

  it('shouldn\'t have a reference to parent list, if it\'s the root of the tree', () => {
    expect(component.parent).toBe(null);
  });

  it('should have a reference to parent file list if nested', () => {
    component.directory = { name: '', contents: [
      { name: 'level1', contents: [
        { name: 'main.py', content: '' }
      ]}
    ]};

    fixture.detectChanges();

    let nestedList = fixture.debugElement.query(By.css('ml-file-tree'));
    expect(nestedList.componentInstance.parent).toBeDefined();
  });

  afterEach(() => {
    component = null;
  });
});
