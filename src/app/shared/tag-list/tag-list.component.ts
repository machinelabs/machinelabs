import { Component, Input } from '@angular/core';

@Component({
  selector: 'ml-tag-list',
  template: `
    <md-chip-list>
      <md-chip color="primary" selected="true" *ngFor="let tag of tags">{{tag}}</md-chip>
    </md-chip-list>
  `,
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent {

  @Input() tags = [];
}
