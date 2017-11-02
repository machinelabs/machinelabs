export interface MountOption {
  // <user>/<mount>/<version> (e.g machinelabs/mnist/1)
  path: string;
  // The name the user wants to use inside the execution (e.g. mnistset)
  name: string;
}