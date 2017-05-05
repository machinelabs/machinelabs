import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineLabsMaterialModule } from './ml-material.module';
import { TagListComponent } from './tag-list/tag-list.component';

@NgModule({
  declarations: [TagListComponent],
  imports: [MachineLabsMaterialModule, CommonModule],
  exports: [TagListComponent]
})
export class SharedModule {}
