import { Component, Input } from '@angular/core';

@Component({
  selector: 'ml-tag-list',
  template: `
    <mat-chip-list>
      <mat-chip color="primary" selected="true" disabled="true" *ngFor="let tag of tags">{{tag}}</mat-chip>
    </mat-chip-list>
  `,
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent {

  @Input() tags = [];
}
