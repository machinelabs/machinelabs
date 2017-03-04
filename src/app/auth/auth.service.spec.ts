/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthService, OfflineAuthService, FirebaseAuthService } from './index';

import '../rx.operators';

describe('OfflineAuthService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useClass: OfflineAuthService }]
    });
  });

  describe('.authenticate()', () => {

    it('should resolve with dummy User object', inject([AuthService], (service: AuthService) => {
      service.authenticate().subscribe(user => {
        expect(user).toBeDefined();
        expect(user.displayName).toEqual('Tony Stark');
        expect(user.email).toEqual('tony@starkindustries.com');
        expect(user.isAnonymous).toBe(true);
        expect(user.photoUrl).toBe(null);
      });
    }));
  });
});
