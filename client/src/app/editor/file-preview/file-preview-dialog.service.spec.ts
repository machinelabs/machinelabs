import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { Location, CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule, NO_ERRORS_SCHEMA, Component, ViewContainerRef } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule, OverlayContainer } from '@angular/cdk/overlay';
import { MatProgressSpinnerModule } from '@angular/material';
import { ESCAPE } from '@angular/cdk/keycodes';

import { FilePreviewDialogService } from './file-preview-dialog.service';
import { OutputFile } from '../../models/output-file';
import { FilePreviewDialogComponent } from './file-preview-dialog/file-preview-dialog.component';
import { FilePreviewDialogToolbarComponent } from './file-preview-dialog-toolbar/file-preview-dialog-toolbar.component';

import { dispatchKeyboardEvent } from '../../../test-helper/dispatch-events';

describe('FilePreviewDialogService', () => {

  let dialog: FilePreviewDialogService;
  let mockLocation: SpyLocation;
  let overlayContainerElement: HTMLElement;
  let viewContainerFixture: ComponentFixture<TestComponent>;

  let outputFile: OutputFile;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilePreviewDialogTestModule],
      providers: [
        {
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        }
      ]
    });

    dialog = TestBed.get(FilePreviewDialogService);
    mockLocation = TestBed.get(Location);

    viewContainerFixture = TestBed.createComponent(TestComponent);
    viewContainerFixture.detectChanges();

    outputFile = {
      content_type: '',
      created_at: 1507115653682,
      download_url: 'https://goo.gl/jHxJjR',
      execution_id: '1507115649639-rk9FzrfnW',
      id: '-Kvb4xcedUJTm331Qiop',
      name: 'output_image_1.jpg',
      path: 'executions/1507115649639-rk9FzrfnW/outputs/output_image_1.jpg',
      size_bytes: 204607,
      user_id: '5Yh73eYomSfTOcHFUx5EzkN5r1B3'
    };
  });

  it('should open a dialog', () => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    viewContainerFixture.detectChanges();

    expect(dialogRef).toBe(dialogRef.containerInstance.dialogRef);
    expect(overlayContainerElement.querySelector('ml-output-file-preview-dialog')).toBeTruthy();
  });

  it('should inject the output file into the component instance', () => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    viewContainerFixture.detectChanges();

    expect(outputFile).toBe(dialogRef.containerInstance.data.outputFile);
  });

  it('should take config defaults when not specified otherwise', () => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop').classList).toContain('dark-backdrop');
    expect(overlayContainerElement.querySelector('.cdk-overlay-pane').classList).toContain('ml-file-preview-dialog-panel');
  });

  it('should override config defaults', () => {
    const dialogRef = dialog.open({
      backdropClass: 'foo',
      panelClass: 'bar',
      data: {
        outputFile
      }
    });

    viewContainerFixture.detectChanges();

    const backdropClasses = overlayContainerElement.querySelector('.cdk-overlay-backdrop').classList;
    const panelOverlayClasses = overlayContainerElement.querySelector('.cdk-overlay-pane').classList;

    expect(backdropClasses).toContain('foo');
    expect(backdropClasses).not.toContain('dark-backdrop');
    expect(panelOverlayClasses).toContain('bar');
    expect(panelOverlayClasses).not.toContain('ml-file-preview-dialog-panel');
  });

  it('should set proper animation states', () => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    viewContainerFixture.detectChanges();

    expect(dialogRef.containerInstance.animationState).toBe('enter');

    dialogRef.close();

    expect(dialogRef.containerInstance.animationState).toBe('leave');
  });

  it('should close a dialog and and call beforeClose before it is closed', (done) => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    const beforeCloseCallback = jasmine.createSpy('beforeClose callback').and.callFake(() => {
      expect(overlayContainerElement.querySelector('ml-output-file-preview-dialog'))
        .not.toBeNull('Dialog container exists when beforeClose is called');
    });

    dialogRef.beforeClose().subscribe(beforeCloseCallback);
    dialogRef.close();
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(beforeCloseCallback).toHaveBeenCalled();
      expect(overlayContainerElement.querySelector('ml-output-file-preview-dialog')).toBeNull();
      done();
    });
  });

  it('should close a dialog and call afterClose after it was closed', (done) => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    let afterCloseCallback = jasmine.createSpy('afterClose callback');

    dialogRef.afterClosed().subscribe(afterCloseCallback);
    dialogRef.close();
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(afterCloseCallback).toHaveBeenCalled();
      expect(overlayContainerElement.querySelector('ml-output-file-preview-dialog')).toBeNull();
      done();
    });
  });

  it('should close a dialog when the escape key is pressed', (done) => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    dispatchKeyboardEvent(document, 'keydown', ESCAPE);
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(overlayContainerElement.querySelector('ml-output-file-preview-dialog')).toBeNull();
      done();
    });
  });

  it('should close when backdrop is clicked', (done) => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

    backdrop.click();
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(overlayContainerElement.querySelector('ml-output-file-preview-dialog')).toBeNull();
      done();
    });
  });

  it('should emit on backdropClick when backdrop is clicked', (done) => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    const backdropClickSpy = jasmine.createSpy('backdropClick spy');
    dialogRef.backdropClick().subscribe(backdropClickSpy);

    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

    backdrop.click();
    expect(backdropClickSpy).toHaveBeenCalledTimes(1);

    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      backdrop.click();
      expect(backdropClickSpy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should close dialog when location changes', (done) => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    mockLocation.simulateUrlPop('');
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(overlayContainerElement.querySelector('ml-output-file-preview-dialog')).toBeNull();
      done();
    });
  });

  it('should clear the reference to the component after the dialog is closed', (done) => {
    const dialogRef = dialog.open({
      data: {
        outputFile
      }
    });

    expect(dialogRef.containerInstance).toBeTruthy();

    dialogRef.close();
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(dialogRef.containerInstance).toBeFalsy('Expected reference to have been cleared.');
      done();
    });
  });
});

@Component({
  template: 'Test'
})
class TestComponent {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    MatProgressSpinnerModule,
    NoopAnimationsModule
  ],
  declarations: [
    FilePreviewDialogComponent,
    FilePreviewDialogToolbarComponent,
    TestComponent
  ],
  providers: [
    FilePreviewDialogService,
    { provide: Location, useClass: SpyLocation }
  ],
  entryComponents: [
    TestComponent,
    FilePreviewDialogComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
class FilePreviewDialogTestModule { }
