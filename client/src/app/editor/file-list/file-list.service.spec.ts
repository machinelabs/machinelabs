import { TestBed, inject } from '@angular/core/testing';

import { FileListService } from './file-list.service';
import { Directory, File, LabDirectory } from '@machinelabs/core/models/directory';

describe('FileListService', () => {
  let fileListService: FileListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileListService]
    });

    fileListService = TestBed.get(FileListService);
  });

  it('should be created', () => {
    expect(fileListService).toBeTruthy();
  });

  it('should collapse directory', () => {
    const directory: Directory = { name: 'main.py', contents: [] };

    fileListService.collapseDirectory(directory);

    expect(directory.clientState.collapsed).toBeTruthy();
  });

  it('should expand directory', () => {
    const directory: Directory = { name: 'main.py', contents: [], clientState: { collapsed: true } };

    fileListService.expandDirectory(directory);

    expect(directory.clientState.collapsed).toBeFalsy();
  });

  it('should not throw an error when collapsing an undefined directory', () => {
    expect(() => {
      fileListService.collapseDirectory(null);
    }).not.toThrow('Cannot read property \'clientState\' of null');
  });

  it('should collapse a LabDirectory', () => {
    const labDirectory: LabDirectory = [
      { name: 'lib', contents: [] },
      { name: 'shared', contents: [] }
    ];

    fileListService.collapseAll(labDirectory);

    labDirectory.map(directory => {
      expect(directory.clientState.collapsed).toBeTruthy();
    });
  });

  it('should collapse all directories', () => {
    const libDirectory: Directory = { name: 'lib', contents: [] };
    const sharedDirectory: Directory = { name: 'shared', contents: [] };

    const directory: Directory = { name: 'src', contents: [libDirectory, sharedDirectory] };

    fileListService.collapseAll(directory);

    expect(directory.clientState.collapsed).toBeTruthy();
    expect(libDirectory.clientState.collapsed).toBeTruthy();
    expect(sharedDirectory.clientState.collapsed).toBeTruthy();
  });

  it('should select file', () => {
    const file: File = { name: 'main.py', content: '' };

    fileListService.selectFile(file);

    expect(file.clientState.selected).toBeTruthy();
  });

  it('should not throw an expection when selecting an undefined file', () => {
    expect(() => {
      fileListService.selectFile(null);
    }).not.toThrow('Cannot read property \'clientState\' of null');
  });

  it('should unselect file', () => {
    const file: File = { name: 'main.py', content: '' };

    fileListService.unselectFile(file);

    expect(file.clientState.selected).toBeFalsy();
  });
});
