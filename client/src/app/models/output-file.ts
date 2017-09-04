export interface OutputFile {
  id: string,
  name: string;
  path: string;
  download_url: string;
  size_bytes: number;
  content_type: string;
  created_at: number;
  execution_id: string;
  user_id: string;
}
