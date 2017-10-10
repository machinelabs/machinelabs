import { Directory, File, instanceOfFile, instanceOfDirectory, LabDirectory } from '../../models/directory';

const concatIfNotEmpty = (cmd: string) => cmd.length > 0 ? ` && ${cmd}` : '';

// ATTENTION: The formatting is important here. We have to use a Here Doc because of multi line strings
// http://stackoverflow.com/questions/2953081/how-can-i-write-a-here-doc-to-a-file-in-bash-script/2954835#2954835
const createWriteFileCmd = (file: File) => `{ cat <<'EOL' > ${file.name}
${file.content}
EOL
}`;

export const createWriteLabDirectoryCmd = (labDirectory: LabDirectory) =>
                                          createWriteDirectoryCmd({ contents: labDirectory, name: '' }, true);

export const createWriteDirectoryCmd = (directory: Directory, skipRoot = false): string => {
  let commands: Array<string> = [];
  directory.contents.forEach(fileOrDir => {
    if (instanceOfFile(fileOrDir)) {
      commands.push(createWriteFileCmd(fileOrDir));
    } else if (instanceOfDirectory(fileOrDir)) {
      commands.push(createWriteDirectoryCmd(fileOrDir));
    }
  });

  // We can't use & (async) instead of && for the file creation part because
  // That would mean that the process completes before files may be written.
  // So we use && for correctness even if it's worse for perf.

  return skipRoot ? commands.join(' && ') :
         `mkdir -p ${directory.name} && (cd ${directory.name} ${concatIfNotEmpty(commands.join(' && '))})`;
};
