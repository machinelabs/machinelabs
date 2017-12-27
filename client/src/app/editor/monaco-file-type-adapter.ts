import { File } from '@machinelabs/models';
import { File as MonacoFile } from 'ngx-monaco';

export class MonacoFileTypeAdapter {

  static labFileToMonacoFile(file: File): MonacoFile {
    return {
      uri: file.name,
      content: file.content,
      language: 'python'
    };
  }

  static monacoFileToLabFile(file: MonacoFile): File {
    return {
      name: file.uri,
      content: file.content
    }
  }
}
