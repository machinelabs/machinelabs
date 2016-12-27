/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FileTreeComponent } from './file-tree.component';

describe('FileTreeComponent', () => {

  let component: FileTreeComponent;

  beforeEach(() => {
    component = new FileTreeComponent();
  });

  describe('.isRemovable(file: File)', () => {

    it('should be true when file isn\'t \'main.py\' or more than one file exists', () => {
      component.files = [
        { name: 'main.py', content: '' },
        { name: 'second.py', content: '' }
      ];

      expect(component.isRemovable({ name: 'second.py' })).toBe(true);
      expect(component.isRemovable({ name: 'main.py' })).toBe(false);

      component.files = [{ name: 'second.py', content: '' }];

      expect(component.isRemovable({ name: 'second.py' })).toBe(false);
    });
  });
});

