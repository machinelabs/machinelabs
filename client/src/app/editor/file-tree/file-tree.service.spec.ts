import { TestBed, inject } from '@angular/core/testing';

import { FileTreeService } from './file-tree.service';
import { Directory, File, LabDirectory } from '@machinelabs/models';

describe('FileTreeService', () => {
  let fileTreeService: FileTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileTreeService]
    });

    fileTreeService = TestBed.get(FileTreeService);
  });

  it('should be created', () => {
    expect(fileTreeService).toBeTruthy();
  });

  it('should collapse directory', () => {
    const directory: Directory = { name: 'main.py', contents: [] };

    fileTreeService.collapseDirectory(directory);

    expect(directory.clientState.collapsed).toBeTruthy();
  });

  it('should expand directory', () => {
    const directory: Directory = { name: 'main.py', contents: [], clientState: { collapsed: true } };

    fileTreeService.expandDirectory(directory);

    expect(directory.clientState.collapsed).toBeFalsy();
  });

  it('should not throw an error when collapsing an undefined directory', () => {
    expect(() => {
      fileTreeService.collapseDirectory(null);
    }).not.toThrow("Cannot read property 'clientState' of null");
  });

  it('should collapse a LabDirectory', () => {
    const labDirectory: LabDirectory = [{ name: 'lib', contents: [] }, { name: 'shared', contents: [] }];

    fileTreeService.collapseAll(labDirectory);

    labDirectory.map(directory => {
      expect(directory.clientState.collapsed).toBeTruthy();
    });
  });

  it('should collapse all directories', () => {
    const libDirectory: Directory = { name: 'lib', contents: [] };
    const sharedDirectory: Directory = { name: 'shared', contents: [] };

    const directory: Directory = { name: 'src', contents: [libDirectory, sharedDirectory] };

    fileTreeService.collapseAll(directory);

    expect(directory.clientState.collapsed).toBeTruthy();
    expect(libDirectory.clientState.collapsed).toBeTruthy();
    expect(sharedDirectory.clientState.collapsed).toBeTruthy();
  });

  it('should select file', () => {
    const file: File = { name: 'main.py', content: '' };

    fileTreeService.selectFile(file);

    expect(file.clientState.selected).toBeTruthy();
  });

  it('should not throw an expection when selecting an undefined file', () => {
    expect(() => {
      fileTreeService.selectFile(null);
    }).not.toThrow("Cannot read property 'clientState' of null");
  });

  it('should unselect file', () => {
    const file: File = { name: 'main.py', content: '' };

    fileTreeService.unselectFile(file);

    expect(file.clientState.selected).toBeFalsy();
  });
});
