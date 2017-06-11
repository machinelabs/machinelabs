
const DEFAULT_HARDWARE_TYPE = 'economy';

const InvocationType = {
  StartExecution: 0,
  StopExecution: 1
};

function setServer(invocation, serverId) {
  invocation.server = {
    id: serverId,
    [serverId]: {
      timestamp: invocation.common.timestamp
    }
  }
}

function InvocationWriter(getInvocationById, 
                            getServerForHardwareType,
                            getServerFromExecution,
                            updateInvocation) {
  return function (invocationId) {
    if (!invocationId) {
      return;
    }

    return getInvocationById(invocationId)
              .then(invocation => {
                // if for some reason, the invocation is invalid, return null
                // which will result in the invocation not getting a server assigned
                if (!invocation || !invocation.common || !invocation.common.data) {
                  return Promise.resolve(null);
                }

                let typeMap = {
                  [InvocationType.StartExecution]: () => getServerForHardwareType(invocation.common.hardware_type || DEFAULT_HARDWARE_TYPE),
                  [InvocationType.StopExecution]: () => getServerFromExecution(invocation.common.data.execution_id)
                }

                let resolveServerId = typeMap[invocation.common.type] || (() => Promise.resolve(null));

                return resolveServerId().then(serverId => ({invocation: invocation, serverId: serverId }));
              })
              .then(val => {
                if (val && val.serverId) {
                  setServer(val.invocation, val.serverId);
                  return updateInvocation(val.invocation);
                }

                return val ? val.invocation : null;
              });
  }
}



module.exports = InvocationWriter