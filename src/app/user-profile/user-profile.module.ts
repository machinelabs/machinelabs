import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared.module';
import { MachineLabsMaterialModule } from '../ml-material.module';
import { ToolbarModule } from '../toolbar/toolbar.module';

import { UserProfileComponent } from './user-profile.component';
import { UserResolver, UserLabsResolver } from './user.resolver';

import { USER_PROFILE_ROUTES } from './user-profile.routes';

@NgModule({
  declarations: [
    UserProfileComponent
  ],
  providers: [
    UserResolver,
    UserLabsResolver
  ],
  imports: [
    CommonModule,
    SharedModule,
    MachineLabsMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(USER_PROFILE_ROUTES),
    ToolbarModule
  ]
})
export class UserProfileModule {}
