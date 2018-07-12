import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { filter, map } from 'rxjs/operators';
import { NameDialogComponent, NameDialogType } from './name-dialog.component';
import { FileTreeService } from '../file-tree/file-tree.service';
import { File, Directory } from '@machinelabs/models';
import { updateFileInDirectory } from '@machinelabs/core';

@Injectable()
export class NameDialogService {
  fileNameDialogRef: MatDialogRef<NameDialogComponent>;

  constructor(public dialog: MatDialog, private fileTreeService: FileTreeService) {}

  openEditFolderNameDialog(parentDirectory: Directory, directory?: Directory) {
    return this.openFolderNameDialog(NameDialogType.EditDirectory, parentDirectory, directory);
  }

  openAddFolderNameDialog(parentDirectory: Directory) {
    return this.openFolderNameDialog(NameDialogType.AddDirectory, parentDirectory);
  }

  openFolderNameDialog(type: NameDialogType, parentDirectory: Directory, directory?: Directory) {
    const newDirectory = { name: '', contents: [], clientState: { collapsed: true } };

    this.openNameDialog(type, parentDirectory, directory || newDirectory).subscribe(name => {
      if (directory) {
        directory.name = name;
        this.fileTreeService.collapseDirectory(directory);
      } else {
        parentDirectory.contents.push({ ...newDirectory, name });
      }
    });
  }

  openEditFileNameDialog(parentDirectory: Directory, file: File) {
    return this.openFileNameDialog(NameDialogType.EditFile, parentDirectory, file);
  }

  openAddFileNameDialog(parentDirectory: Directory) {
    return this.openFileNameDialog(NameDialogType.AddFile, parentDirectory);
  }

  openFileNameDialog(type: NameDialogType, parentDirectory: Directory, file?: File) {
    let newFile = { name: '', content: '', clientState: { collapsed: false } };

    return this.openNameDialog(type, parentDirectory, file || newFile).pipe(
      map(name => {
        parentDirectory.clientState = { ...parentDirectory.clientState, collapsed: false };

        if (file) {
          newFile = { ...newFile, name, content: file.content };
          updateFileInDirectory(file, newFile, parentDirectory);
        } else {
          newFile = { ...newFile, name };
          parentDirectory.contents.push(newFile);
        }

        return newFile;
      })
    );
  }

  openNameDialog(type: NameDialogType, parentDirectory: Directory, fileOrDirectory: File | Directory) {
    this.fileNameDialogRef = this.dialog.open(NameDialogComponent, {
      disableClose: false,
      data: {
        parentDirectory,
        fileOrDirectory,
        type: type
      }
    });

    return this.fileNameDialogRef.afterClosed().pipe(filter(name => name !== '' && name !== undefined));
  }
}
