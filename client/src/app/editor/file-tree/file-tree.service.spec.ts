import { TestBed, inject } from '@angular/core/testing';
import { File } from '@machinelabs/core/models/directory';

import { FileTreeService } from './file-tree.service';

describe('FileTreeService', () => {

  let fileTreeService: FileTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileTreeService]
    });
    fileTreeService = TestBed.get(FileTreeService);
  });

  describe('.deleteFromDirectory()', () => {

    it('should remove file from given directory', () => {
      const directory = {
        name: 'Folder',
        contents: [
          { name: 'foo.py', content: '' },
          {
            name: 'Other folder',
            contents: [
              { name: 'bar.py', content: '' }
            ]
          }
        ]
      };

      const expectedDirectory = {
        name: 'Folder',
        contents: [
          {
            name: 'Other folder',
            contents: [
              { name: 'bar.py', content: '' }
            ]
          }
        ]
      };

      const fileToDelete = <File>directory.contents[0];

      fileTreeService.deleteFromDirectory(fileToDelete, directory);
      expect(directory.contents).toEqual(expectedDirectory.contents);
    });
  });

  describe('.updateFileInDirectory()', () => {

    it('should update file in given directoru', () => {
      const directory = {
        name: 'Folder',
        contents: [
          { name: 'foo.py', content: '' },
          {
            name: 'Other folder',
            contents: [
              { name: 'bar.py', content: '' }
            ]
          }
        ]
      };

      const expectedDirectory = {
        name: 'Folder',
        contents: [
          { name: 'jinx.py', content: '' },
          {
            name: 'Other folder',
            contents: [
              { name: 'bar.py', content: '' }
            ]
          }
        ]
      };

      const fileToUpdate = <File>directory.contents[0];
      const update = { name: 'jinx.py', content: '' }

      fileTreeService.updateFileInDirectory(fileToUpdate, update, directory);
      expect(directory.contents).toEqual(expectedDirectory.contents);
    });
  });
});
