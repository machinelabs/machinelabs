import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { LabStorageService } from '../lab-storage.service';
import { UserService } from 'app/user/user.service';
import { User } from '../models/user';

import 'rxjs/add/operator/do';

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(
      private userService: UserService,
      private router: Router,
      private snackBar: MatSnackBar) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.userService
               .getUser(route.paramMap.get('userId'))
               .do(user => {
                 if (!user) {
                   this.snackBar.open('The user doesn\'t exist.', 'Dismiss', { duration: 3000 });
                   this.router.navigate(['/editor']);
                 }
                 return user;
               });
  }
}

@Injectable()
export class UserLabsResolver implements Resolve<any> {

  constructor(private labStorage: LabStorageService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.labStorage.getLabsFromUser(route.paramMap.get('userId'));
  }
}
