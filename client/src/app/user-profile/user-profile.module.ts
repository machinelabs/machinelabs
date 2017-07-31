import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { MachineLabsMaterialModule } from '../ml-material.module';
import { ToolbarModule } from '../toolbar/toolbar.module';

import { UserProfileComponent } from './user-profile.component';
import { UserResolver, UserLabsResolver } from './user.resolver';

import { USER_PROFILE_ROUTES } from './user-profile.routes';

import { EditUserProfileDialogComponent } from './edit-user-profile-dialog/edit-user-profile-dialog.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    EditUserProfileDialogComponent
  ],
  providers: [
    UserResolver,
    UserLabsResolver
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MachineLabsMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(USER_PROFILE_ROUTES),
    ToolbarModule
  ],
  entryComponents: [
    EditUserProfileDialogComponent
  ]
})
export class UserProfileModule {}
