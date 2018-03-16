import { Injectable, Injector, Inject, ViewContainerRef, ComponentRef } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { FilePreviewDialogComponent } from './file-preview-dialog/file-preview-dialog.component';
import { FilePreviewDialogRef } from './file-preview-dialog-ref';

import { OutputFile } from '../../models/output-file';

import { OverlayConfig, ScrollStrategy, OverlayRef, Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';

import { FILE_PREVIEW_DIALOG_DATA } from './file-preview.tokens';

export interface FilePreviewDialogData {
  outputFile: OutputFile;
}

export interface FilePreviewDialogConfig {
  data: FilePreviewDialogData;
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  viewContainerRef?: ViewContainerRef;
}

const DEFAULT_CONFIG: FilePreviewDialogConfig = {
  data: null,
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'ml-file-preview-dialog-panel',
  viewContainerRef: null
};

@Injectable()
export class FilePreviewDialogService {
  private openDialog: FilePreviewDialogRef = null;

  constructor(private overlay: Overlay, private injector: Injector, private location: Location) {
    location.subscribe(() => {
      if (this.openDialog) {
        this.openDialog.close();
      }
    });
  }

  open(config: FilePreviewDialogConfig) {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    const overlayRef = this.createOverlay(dialogConfig);
    const dialogRef = new FilePreviewDialogRef(overlayRef);
    const dialogContainer = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

    dialogRef.containerInstance = dialogContainer;

    overlayRef.backdropClick().subscribe(_ => dialogRef.close());
    dialogRef.afterClosed().subscribe(_ => (this.openDialog = null));

    this.openDialog = dialogRef;

    return dialogRef;
  }

  private createOverlay(config: FilePreviewDialogConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(
    overlayRef: OverlayRef,
    config: FilePreviewDialogConfig,
    dialogRef: FilePreviewDialogRef
  ) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(FilePreviewDialogComponent, config.viewContainerRef, injector);
    const containerRef: ComponentRef<FilePreviewDialogComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: FilePreviewDialogConfig, dialogRef: FilePreviewDialogRef): PortalInjector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    const injectionTokens = new WeakMap();

    injectionTokens.set(FilePreviewDialogRef, dialogRef);
    injectionTokens.set(FILE_PREVIEW_DIALOG_DATA, config.data);

    return new PortalInjector(userInjector || this.injector, injectionTokens);
  }

  private getOverlayConfig(config: FilePreviewDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
}
