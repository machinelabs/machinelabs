import 'jest';
import { InvocationProcessor } from './invocation-processor';
import { ServerResolver } from './server-resolver/server-resolver';

describe('InvocationResolver', () => {
  it('should not try to get Invocation for non ids', () => {
    const mockedInvocation = { id: 1 };
    const getInvocation = jest.fn();
    getInvocation.mockReturnValue(mockedInvocation);

    const writer = new InvocationProcessor(getInvocation, null, null);

    writer.process(undefined);
    expect(getInvocation.mock.calls.length).toBe(0);
  });

  it('should attach random server for start invocation', done => {
    const mockedInvocation: any = {
      common: {
        id: 1,
        type: 'start_execution',
        data: {},
        timestamp: 0
      }
    };

    const server = {
      id: 'fukuk'
    };

    const expectedInvocation = Object.assign({}, mockedInvocation);
    expectedInvocation.server = {
      id: server.id,
      [server.id]: {
        timestamp: mockedInvocation.common.timestamp
      }
    };

    const getInvocation = jest.fn();
    getInvocation.mockReturnValue(Promise.resolve(mockedInvocation));

    const getServerForHardwareType = jest.fn();
    getServerForHardwareType.mockReturnValue(Promise.resolve(server.id));

    const getServerFromExecution = jest.fn();
    getServerFromExecution.mockReturnValue(Promise.resolve(null));

    const updateInvocation = jest.fn(inv => Promise.resolve(inv));

    const serverResolver = new ServerResolver(getServerForHardwareType, getServerFromExecution);

    const writer = new InvocationProcessor(getInvocation, serverResolver, updateInvocation);

    const invocation = writer.process('1');

    invocation.then(resolvedInv => {
      expect(getInvocation.mock.calls.length).toBe(1);
      expect(updateInvocation.mock.calls.length).toBe(1);
      expect(getServerForHardwareType.mock.calls.length).toBe(1);
      expect(getServerFromExecution.mock.calls.length).toBe(0);
      expect(resolvedInv).toEqual(expectedInvocation);
      done();
    });
  });

  it('should not update if server cant be resolved', done => {
    const mockedInvocation = {
      common: {
        id: 1,
        type: 'start_execution',
        data: {},
        timestamp: 0
      }
    };

    const expectedInvocation = Object.assign({}, mockedInvocation);

    const getInvocation = jest.fn();
    getInvocation.mockReturnValue(Promise.resolve(mockedInvocation));

    const getServerForHardwareType = jest.fn();
    getServerForHardwareType.mockReturnValue(Promise.resolve(null));

    const getServerFromExecution = jest.fn();
    getServerFromExecution.mockReturnValue(Promise.resolve(null));

    const updateInvocation = jest.fn(inv => Promise.resolve(inv));

    const serverResolver = new ServerResolver(getServerForHardwareType, getServerFromExecution);

    const writer = new InvocationProcessor(getInvocation, serverResolver, updateInvocation);

    const invocation = writer.process('1');

    invocation.then(resolvedInv => {
      expect(getInvocation.mock.calls.length).toBe(1);
      expect(updateInvocation.mock.calls.length).toBe(0);
      expect(getServerForHardwareType.mock.calls.length).toBe(1);
      expect(getServerFromExecution.mock.calls.length).toBe(0);
      expect(resolvedInv).toEqual(expectedInvocation);
      done();
    });
  });

  it('should attach server from execution for stop invocation', done => {
    const mockedInvocation: any = {
      common: {
        id: 1,
        type: 'stop_execution',
        timestamp: 0,
        data: {
          execution_id: 1
        }
      }
    };

    const server = {
      id: 'fukuk'
    };

    const expectedInvocation = Object.assign({}, mockedInvocation);
    expectedInvocation.server = {
      id: server.id,
      [server.id]: {
        timestamp: mockedInvocation.common.timestamp
      }
    };

    const getInvocation = jest.fn();
    getInvocation.mockReturnValue(Promise.resolve(mockedInvocation));

    const getServerForHardwareType = jest.fn();
    getServerForHardwareType.mockReturnValue(Promise.resolve(server.id));

    const getServerFromExecution = jest.fn();
    getServerFromExecution.mockReturnValue(Promise.resolve(server.id));

    const updateInvocation = jest.fn(inv => Promise.resolve(inv));

    const serverResolver = new ServerResolver(getServerForHardwareType, getServerFromExecution);

    const writer = new InvocationProcessor(getInvocation, serverResolver, updateInvocation);

    const invocation = writer.process('1');

    invocation.then(resolvedInv => {
      expect(getInvocation.mock.calls.length).toBe(1);
      expect(getServerForHardwareType.mock.calls.length).toBe(0);
      expect(getServerFromExecution.mock.calls.length).toBe(1);
      expect(updateInvocation.mock.calls.length).toBe(1);
      expect(resolvedInv).toEqual(expectedInvocation);
      done();
    });
  });
});
