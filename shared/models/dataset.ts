export interface Dataset {
  userId: string;
  datasetId: string;
  description: string;
  latest_version: string;
  private: boolean;
  versions: Map<string, string>;
}