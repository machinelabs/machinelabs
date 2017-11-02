export enum HardwareType {
  Economy = 'economy',
  Premium = 'premium'
}

export class Server {
  id: string;
  name: string;
  // tslint:disable-next-line
  hardware_type: HardwareType;
}
