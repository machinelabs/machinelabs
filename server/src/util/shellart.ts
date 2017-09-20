import * as ansi from 'ansi-escape-sequences';

export const bold = (str: string) => ansi.format(str, ['bold']);
export const newLines = (n: number) => `\r\n`.repeat(n);
export const newLine = () => newLines(1);
