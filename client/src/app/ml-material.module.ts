import { NgModule } from '@angular/core';
import {
  MatDialogModule,
  MatSnackBarModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatIconModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatChipsModule,
  MatTabsModule,
  MatTooltipModule,
  MatCardModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatTableModule,
  MATERIAL_COMPATIBILITY_MODE
} from '@angular/material';

@NgModule({
  exports: [
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTableModule
  ],
  providers: [
    { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }
  ]
})
export class MachineLabsMaterialModule {}
