import { File, LabDirectory, instanceOfFile } from '@machinelabs/models';

export const MAIN_PYTHON_FILENAME = 'main.py';

export const getMainFile = (dir: LabDirectory) =>
                           <File>dir.find(file => file.name === MAIN_PYTHON_FILENAME && instanceOfFile(file));


