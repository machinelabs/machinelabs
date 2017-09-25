export interface LabInput {
  url: string;
  name: string;
}

export interface ScriptParameter {
  'pass-as': string;
}

export class PublicLabConfiguration {
  dockerImageId: string;
  inputs: Array<LabInput> = [];
  parameters: Array<ScriptParameter> = [];
}

export class InternalLabConfiguration extends PublicLabConfiguration {
  // e.g. 'floydhub/tensorflow:latest-py3@sha256:d0bf867c1924b4448f3eec833013e1fdd1a22f28a478479094945cccee4fda46'
  imageWithDigest: string;
}
