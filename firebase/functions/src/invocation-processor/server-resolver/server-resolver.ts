import { InvocationType, Invocation, InvocationWrapper } from '../../models/invocation';

export class ServerResolver {

    private map: Map<InvocationType, (invocation: Invocation) => Promise<string>> = new Map();

    constructor(private fromHardwareTypeFn, private fromExecutionFn) {
      this.map.set(InvocationType.StartExecution, fromHardwareTypeFn);
      this.map.set(InvocationType.StopExecution, fromExecutionFn);
    }

    getServer(invocationWrapper: InvocationWrapper) {

      // if for some reason, the invocation is invalid, return null
      // which will result in the invocation not getting a server assigned
      if (!invocationWrapper || !invocationWrapper.common || !invocationWrapper.common.data) {
        return Promise.resolve(null);
      }

      let fn = this.map.get(invocationWrapper.common.type);
      return fn ? fn(invocationWrapper.common) : Promise.resolve(null);
    }
  }
