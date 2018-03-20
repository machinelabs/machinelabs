import { InvocationType, Invocation, InvocationWrapper } from '../models/invocation';
import { ServerResolver } from './server-resolver/server-resolver';

export type getInvocationFn = (invocationId: string) => Promise<InvocationWrapper>;
export type updateInvocationFn = (invocationWrapper: InvocationWrapper) => Promise<any>;

export class InvocationProcessor {
  constructor(
    private getInvocation: getInvocationFn,
    private serverResolver: ServerResolver,
    private updateInvocation: updateInvocationFn
  ) {}

  process(invocationId: string) {
    console.log(`Processing invocation: ${invocationId}`);

    if (!invocationId) {
      console.log(`Invalid invocation id`);
      return Promise.resolve(null);
    }

    return this.getInvocation(invocationId)
      .then(invocationWrapper =>
        this.serverResolver
          .getServer(invocationWrapper)
          .then(serverId => ({ invocation: invocationWrapper, serverId: serverId }))
      )
      .then(val => {
        if (val && val.serverId) {
          this.setServer(val.invocation, val.serverId);
          return this.updateInvocation(val.invocation);
        }

        return val ? val.invocation : null;
      });
  }

  private setServer(invocationWrapper, serverId) {
    invocationWrapper.server = {
      id: serverId,
      [serverId]: {
        timestamp: invocationWrapper.common.timestamp
      }
    };
  }
}
