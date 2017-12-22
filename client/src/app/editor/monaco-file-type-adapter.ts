import { File } from '@machinelabs/models';
import { MonacoFile } from 'ngx-monaco';

export class MonacoFileTypeAdapter {

  static labFileToMonacoFile(file: File): MonacoFile {
    return {
      uri: file.name,
      content: file.content
    };
  }

  static monacoFileToLabFile(file: MonacoFile): File {
    return {
      name: file.uri,
      content: file.content
    }
  }
}
