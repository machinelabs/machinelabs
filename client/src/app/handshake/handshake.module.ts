import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { MachineLabsMaterialModule } from '../ml-material.module';
import { ToolbarModule } from '../toolbar/toolbar.module';

import { HANDSHAKE_ROUTES } from './handshake.routes';

import { HandshakeComponent } from './handshake.component';

@NgModule({
  declarations: [
    HandshakeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MachineLabsMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(HANDSHAKE_ROUTES),
    ToolbarModule
  ]
})
export class HandshakeModule {}
