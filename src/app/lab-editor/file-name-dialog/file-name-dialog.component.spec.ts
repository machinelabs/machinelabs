import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MdDialogModule, MdDialog } from '@angular/material';

import { TestBed, ComponentFixture, inject } from '@angular/core/testing';

import { FileNameDialogComponent } from './file-name-dialog.component';

describe('FileNameDialogComponent', () => {

  let fixture: ComponentFixture<FileNameDialogComponent>;
  let component: FileNameDialogComponent;
  let dialog: MdDialog;
  let testName = 'test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MdDialogModule.forRoot(), DialogTestModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(inject([MdDialog], (d: MdDialog) => {
    dialog = d;
  }));

  it('should have an invalid form if no file name is entered', () => {
    let dialogRef = dialog.open(FileNameDialogComponent, {
      data: {
        fileName: '',
      }
    });

    component = dialogRef.componentInstance;
    component.ngOnInit();
    expect(component.form.valid).toBe(false);

    component.form.setValue({filename: testName});
    expect(component.form.valid).toBe(true);
  });

  it('should be pre-filled with a file name if data is given', () => {
    let dialogRef = dialog.open(FileNameDialogComponent, {
      data: {
        fileName: testName
      }
    });

    component = dialogRef.componentInstance;
    component.ngOnInit();
    expect(component.form.get('filename').value).toEqual(testName);
  });

  it('should emit close event with entered file name', () => {
    let dialogRef = dialog.open(FileNameDialogComponent, {
      data: {
        fileName: '',
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

@NgModule({
  imports: [MdDialogModule, ReactiveFormsModule, CommonModule],
  declarations: [FileNameDialogComponent],
  exports: [FileNameDialogComponent],
  entryComponents: [FileNameDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
class DialogTestModule {}
