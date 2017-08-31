import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Router } from '@angular/router';
import { UserService, PLACEHOLDER_USERNAME } from './user/user.service';
import { MdSnackBar } from '@angular/material';

import 'rxjs/add/operator/switchMap';

@Injectable()
export class LoginService {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MdSnackBar) {}

  loginWithGitHub() {
    this.authService.linkOrSignInWithGitHub()
                    .switchMap(loginUser => this.userService.createUserIfMissing())
                    .subscribe(user => {

      if (user.displayName === PLACEHOLDER_USERNAME) {
        this.router.navigate(['/user', user.id], { queryParams: { editing: true }});
      }

      this.snackBar.open(`Logged in as ${user.displayName}`, 'Dismiss', { duration: 3000 });
    }, e => this.snackBar.open('Login failed, please try again.', 'Dismiss', { duration: 3000 }));
  }

  logout() {
    this.authService.signOut().subscribe(_ => {
      this.snackBar.open('Logged out successfully', 'Dismiss', { duration: 3000 });
    });
  }
}
