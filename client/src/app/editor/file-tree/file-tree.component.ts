import { Component, Input, OnInit } from '@angular/core';
import { File, Directory, LabDirectory } from '@machinelabs/core/models/directory';

import { EditorService } from '../editor.service';

@Component({
  selector: 'ml-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {

  @Input() rootDirectory = null as Directory;

  @Input() showActionButtons = true;

  constructor(private editorService: EditorService) {}

  openFolderNameDialog() {
    this.editorService.openFolderNameDialog(this.rootDirectory);
  }

  openFileNameDialog() {
    this.editorService.openFileNameDialog(this.rootDirectory).subscribe(file => {
      this.editorService.openFile(file);
    });
  }
}
