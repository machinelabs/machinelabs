export interface Mount {
  userId: string;
  name: string;
  description: string;
  latest_version: string;
  private: boolean;
  versions: Map<string, string>;
}
