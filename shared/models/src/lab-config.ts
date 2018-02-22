export interface LabConfigParameter {
  'pass-ass': string;
}

export interface LabConfigInput {
  name: string;
  url: string;
}

export interface LabConfigCli {
  id?: string;
  exclude?: string[];
}

export interface LabConfig {
  dockerImageId?: string;
  parameters?: LabConfigParameter[];
  inputs?: LabConfigInput[];
  cli?: LabConfigCli;
}
