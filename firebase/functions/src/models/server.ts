// DO NOT EDIT. COPY FROM @machinelabs/models instead

export enum HardwareType {
  CPU = 'cpu',
  GPU = 'gpu'
}

export class Server {
  id: string;
  name: string;
  // tslint:disable-next-line
  hardware_type: HardwareType;
}
