
import 'jest';
import {InvocationWriter} from './invocation-writer';

describe('InvocationResolver', () => {
  it('should not try to get Invocation for non ids', () => {

    let mockedInvocation = {id: 1};
    const getInvocation = jest.fn();
    getInvocation.mockReturnValue(mockedInvocation);

    let resolver = InvocationWriter(getInvocation, null, null, null);

    resolver(undefined);
    expect(getInvocation.mock.calls.length).toBe(0);
  });

   it('should attach random server for start invocation', (done) => {

    let mockedInvocation: any = {
      common: {
        id: 1,
        type: 0,
        data: {},
        timestamp: 0
      }
    };

    let server = {
      id: 'fukuk'
    };

    let expectedInvocation = Object.assign({}, mockedInvocation);
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

    const updateInvocation = jest.fn((inv) => Promise.resolve(inv));

    let resolver = InvocationWriter(getInvocation,
                                      getServerForHardwareType,
                                      getServerFromExecution,
                                      updateInvocation);

    let invocation = resolver(1);

    invocation.then((resolvedInv) => {
      expect(getInvocation.mock.calls.length).toBe(1);
      expect(updateInvocation.mock.calls.length).toBe(1);
      expect(getServerForHardwareType.mock.calls.length).toBe(1);
      expect(getServerFromExecution.mock.calls.length).toBe(0);
      expect(resolvedInv).toEqual(expectedInvocation);
      done();
    });
  });

   it('should not update if server cant be resolved', (done) => {

    let mockedInvocation = {
      common: {
        id: 1,
        type: 0,
        data: {},
        timestamp: 0
      }
    };

    let expectedInvocation = Object.assign({}, mockedInvocation);

    const getInvocation = jest.fn();
    getInvocation.mockReturnValue(Promise.resolve(mockedInvocation));

    const getServerForHardwareType = jest.fn();
    getServerForHardwareType.mockReturnValue(Promise.resolve(null));

    const getServerFromExecution = jest.fn();
    getServerFromExecution.mockReturnValue(Promise.resolve(null));

    const updateInvocation = jest.fn((inv) => Promise.resolve(inv));

    let resolver = InvocationWriter(getInvocation,
                                    getServerForHardwareType,
                                    getServerFromExecution,
                                    updateInvocation);

    let invocation = resolver(1);

    invocation.then((resolvedInv) => {
      expect(getInvocation.mock.calls.length).toBe(1);
      expect(updateInvocation.mock.calls.length).toBe(0);
      expect(getServerForHardwareType.mock.calls.length).toBe(1);
      expect(getServerFromExecution.mock.calls.length).toBe(0);
      expect(resolvedInv).toEqual(expectedInvocation);
      done();
    });
  });

  it('should attach server from execution for stop invocation', (done) => {

    let mockedInvocation: any = {
      common: {
        id: 1,
        type: 1,
        timestamp: 0,
        data: {
          execution_id: 1
        }
      }
    };

    let server = {
      id: 'fukuk'
    };

    let expectedInvocation = Object.assign({}, mockedInvocation);
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

    const updateInvocation = jest.fn((inv) => Promise.resolve(inv));

    let resolver = InvocationWriter(getInvocation,
                                      getServerForHardwareType,
                                      getServerFromExecution,
                                      updateInvocation);

    let invocation = resolver(1);

    invocation.then((resolvedInv) => {
      expect(getInvocation.mock.calls.length).toBe(1);
      expect(getServerForHardwareType.mock.calls.length).toBe(0);
      expect(getServerFromExecution.mock.calls.length).toBe(1);
      expect(updateInvocation.mock.calls.length).toBe(1);
      expect(resolvedInv).toEqual(expectedInvocation);
      done();
    });
  });

});
