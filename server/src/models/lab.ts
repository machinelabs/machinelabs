export interface File {
  name: string;
  content: string;
}

export interface Lab {
  id: string;
  files: File[];
}
