import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LabStorageService } from '../lab-storage.service';
import { UserService } from 'app/user/user.service';
import { User } from '../models/user';

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.userService.getUser(route.paramMap.get('userId'));
  }
}

@Injectable()
export class UserLabsResolver implements Resolve<any> {

  constructor(private labStorage: LabStorageService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.labStorage.getLabsFromUser(route.paramMap.get('userId'));
  }
}
