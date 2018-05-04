import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

import { SYSTEM_USER } from '@machinelabs/models';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/handshakes', () => {
  const currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };
  const systemUser = { uid: SYSTEM_USER };

  const testHandshakeRequest = {
    id: '1',
    token: null
  };

  const testHandshakeCommit = {
    id: '1',
    user_id: '1'
  };

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData({
      handshakes: {
        '1': {
          request: {
            id: '1',
            token: null
          }
        },
        '2': {
          request: {
            id: '2',
            token: 'some-token'
          },
          commit: {
            id: '2',
            user_id: '1'
          }
        }
      }
    });

    targaryen.util.setFirebaseRules(rules);
  });

  it('Only System-user can read into all handshake requests', () => {
    expect(anonymousUser).cannotRead('/handshakes/2/request');
    expect(currentUser).cannotRead('/handshakes/2/request');
    expect(systemUser).canRead('/handshakes/2/request');
  });

  it('Only System-user and authenticated users can read into their own handshake request', () => {
    expect(anonymousUser).cannotRead('/handshakes/1/request');
    expect(currentUser).canRead('/handshakes/1/request');
    expect(systemUser).canRead('/handshakes/1/request');
  });

  it('Only authenticated users can write into their own created handshake requests', () => {
    const testHandshakeRequestWithToken = { ...testHandshakeRequest, token: 'some-token' };

    expect(anonymousUser).cannotWrite('/handshakes/1/request', testHandshakeRequestWithToken);
    expect(currentUser).canWrite('/handshakes/1/request', testHandshakeRequestWithToken);
    expect(systemUser).cannotWrite('/handshakes/1/request', testHandshakeRequestWithToken);
  });

  it('Only System-user can read into all handshake commit', () => {
    expect(anonymousUser).cannotRead('/handshakes/2/commit');
    expect(currentUser).cannotRead('/handshakes/2/commit');
    expect(systemUser).canRead('/handshakes/2/commit');
  });

  it('Only System-user and authenticated users can read into their own handshake commit', () => {
    expect(anonymousUser).cannotRead('/handshakes/1/commit');
    expect(currentUser).canRead('/handshakes/1/commit');
    expect(systemUser).canRead('/handshakes/1/commit');
  });

  it('Only authenticated users can write into handshake nodes to create a commit', () => {
    expect(anonymousUser).cannotWrite('/handshakes/1/commit', testHandshakeCommit);
    expect(currentUser).canWrite('/handshakes/1/commit', testHandshakeCommit);
    expect(systemUser).cannotWrite('/handshakes/1/commit', testHandshakeCommit);
  });

  it('Users cannot overwrite existing handshake commits', () => {
    expect(anonymousUser).cannotWrite('/handshakes/2/commit', testHandshakeCommit);
    expect(currentUser).cannotWrite('/handshakes/2/commit', testHandshakeCommit);
    expect(systemUser).cannotWrite('/handshakes/2/commit', testHandshakeCommit);
  });

  describe('Validation', () => {
    const string101 = new Array(101).fill('0').join('');

    it('HandshakeRequest id cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/handshakes/1/request/id', string101);
    });

    it('HandshakeRequest tokes cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/handshakes/1/request/token', string101);
    });

    it('HandshakeCommit id cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/handshakes/1/commit/id', string101);
    });

    it('HandshakeCommit user_id cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/handshakes/1/commit/user_id', string101);
    });
  });
});
