export enum HardwareType {
  Economy = 'economy',
  Premium = 'premium'
} 

export class Server {
  id: string;
  name: string;
  hardware_type: HardwareType
}