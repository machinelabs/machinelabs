import { LAB_STUB } from './lab.stubs';
import { File, Directory, LabDirectory } from '@machinelabs/models';

export const EDITOR_SERVICE_STUB = {
  lab: Object.assign({}, LAB_STUB),
  openFile: (file: File) => {}
}
