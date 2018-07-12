import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { LabStorageService } from '../lab-storage.service';
import { SnackbarService } from '../snackbar.service';
import { UserService } from '../user/user.service';
import { User } from '../models/user';

@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService, private router: Router, private snackBar: SnackbarService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.userService.getUser(route.paramMap.get('userId')).pipe(
      tap(user => {
        if (!user) {
          this.snackBar.notifyUserDoesntExist();
          this.router.navigate(['/editor']);
        }
        return user;
      })
    );
  }
}

@Injectable()
export class UserLabsResolver implements Resolve<any> {
  constructor(private labStorage: LabStorageService, private snackBar: SnackbarService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.labStorage.getLabsFromUser(route.paramMap.get('userId')).pipe(
      catchError(_ => {
        this.snackBar.notifyLoadingUserLabsFailed();
        return of([]);
      })
    );
  }
}
