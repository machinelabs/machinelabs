import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
import { MdDialogModule } from '@angular/material';
import { File } from '@machinelabs/core/models/directory';

import { LAB_STUB, EDITOR_SERVICE_STUB } from '../../../test-helper/stubs';

import { EditorService } from '../editor.service';
import { LabDirectoryService } from '../../lab-directory.service';
import { FileTreeComponent } from './file-tree.component';
import { FileListComponent } from '../file-list/file-list.component';
import { FileListService } from '../file-list/file-list.service';

describe('FileTreeComponent', () => {

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
        { provide: EditorService, useValue: EDITOR_SERVICE_STUB },
        LabDirectoryService,
        FileListService
      ],
      declarations: [FileTreeComponent, FileListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FileTreeComponent);
    component = fixture.componentInstance;
    editorService = TestBed.get(EditorService);

    editorService.lab.directory = testFiles;
    fixture.detectChanges();
  });

  it('should not render action buttons if configured that way', () => {
    component.showActionButtons = false;
    fixture.detectChanges();
    let addButton = fixture.debugElement.query(By.css('.ml-file-tree-cta'));
    expect(addButton).toBe(null);
  });
});
