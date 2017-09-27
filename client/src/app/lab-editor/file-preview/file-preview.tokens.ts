import { InjectionToken } from '@angular/core';
import { ScrollStrategy, Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';

export const FILE_PREVIEW_DIALOG_DATA = new InjectionToken<any>('MlFilePreviewData');

export const FILE_PREVIEW_DIALOG_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('mat-dialog-scroll-strategy');

export function filePreviewDialogScrollStrategyFactory(overlay: Overlay):
  () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

export const FILE_PREVIEW_DIALOG_SCROLL_STRATEGY_PROVIDER = {
  provide: FILE_PREVIEW_DIALOG_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: filePreviewDialogScrollStrategyFactory
};
