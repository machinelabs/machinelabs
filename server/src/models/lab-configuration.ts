import { MountOption } from '@machinelabs/models';

export interface LabInput {
  url: string;
  name: string;
}

export interface ScriptParameter {
  'pass-as': string;
}

export interface MountPoint {
  source: string;
  destination: string;
}

export class PublicLabConfiguration {
  dockerImageId: string;
  inputs: Array<LabInput> = [];
  parameters: Array<ScriptParameter> = [];
  mounts: Array<MountOption>;
}

export class InternalLabConfiguration extends PublicLabConfiguration {
  // e.g. 'floydhub/tensorflow:latest-py3@sha256:d0bf867c1924b4448f3eec833013e1fdd1a22f28a478479094945cccee4fda46'
  imageWithDigest: string;
  mountPoints: Array<MountPoint> = [];
  errors: Array<string> = [];
}
