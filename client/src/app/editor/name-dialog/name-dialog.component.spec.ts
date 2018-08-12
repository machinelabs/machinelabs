import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material';

import { TestBed, ComponentFixture, inject } from '@angular/core/testing';

import { NameDialogComponent } from './name-dialog.component';

@NgModule({
  imports: [MatDialogModule, ReactiveFormsModule, CommonModule],
  declarations: [NameDialogComponent],
  exports: [NameDialogComponent],
  entryComponents: [NameDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
class DialogTestModule {}

describe('NameDialogComponent', () => {
  let component: NameDialogComponent;
  let dialog: MatDialog;
  const testName = 'test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, DialogTestModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(inject([MatDialog], (d: MatDialog) => {
    dialog = d;
  }));

  it('should have an invalid form if no file name is entered', () => {
    const directory = { name: '', contents: [] };
    const file = { name: '', content: '' };
    const dialogRef = dialog.open(NameDialogComponent, {
      data: {
        fileOrDirectory: file,
        parentDirectory: directory
      }
    });

    component = dialogRef.componentInstance;
    component.ngOnInit();
    expect(component.form.valid).toBe(false);

    component.form.setValue({ filename: testName });
    expect(component.form.valid).toBe(true);
  });

  it('should be pre-filled with a file name if data is given', () => {
    const directory = { name: '', contents: [] };
    const file = { name: 'test', content: '' };
    const dialogRef = dialog.open(NameDialogComponent, {
      data: {
        fileOrDirectory: file,
        parentDirectory: directory
      }
    });

    component = dialogRef.componentInstance;
    component.ngOnInit();
    expect(component.form.get('filename').value).toEqual(testName);
  });

  it('should emit close event with entered file name', () => {
    const directory = { name: '', contents: [] };
    const file = { name: 'test', content: '' };
    const dialogRef = dialog.open(NameDialogComponent, {
      data: {
        fileOrDirectory: file,
        parentDirectory: directory
      }
    });

    spyOn(dialogRef, 'close');

    component = dialogRef.componentInstance;
    component.ngOnInit();

    component.form.setValue({ filename: testName });
    component.submit(component.form);
    expect(dialogRef.close).toHaveBeenCalledWith(testName);
  });
});
