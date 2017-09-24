import { Component, Input, OnInit } from '@angular/core';
import { File, Directory, LabDirectory } from '@machinelabs/core/models/directory';
import { getMainFile } from '../util/file-tree-helper';

import { EditorService } from '../editor.service';

@Component({
  selector: 'ml-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent implements OnInit {

  rootDirectory: Directory = { name: '', contents: null };

  @Input() showActionButtons = true;

  constructor(private editorService: EditorService) {}

  ngOnInit() {
    // this needs to run in ngOnInit to ensure `editorService.lab` exists
    this.rootDirectory.contents = this.editorService.lab.directory;
  }

  openFolderNameDialog() {
    this.editorService.openFolderNameDialog(this.rootDirectory);
  }

  openFileNameDialog() {
    this.editorService.openFileNameDialog(this.rootDirectory);
  }
}
