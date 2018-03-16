import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SnackbarService } from './snackbar.service';
import { UserService, PLACEHOLDER_USERNAME } from './user/user.service';

@Injectable()
export class LoginService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: SnackbarService
  ) {}

  loginWithGitHub() {
    this.authService
      .linkOrSignInWithGitHub()
      .pipe(switchMap(loginUser => this.userService.createUserIfMissing()))
      .subscribe(
        user => {
          if (user.displayName === PLACEHOLDER_USERNAME) {
            this.router.navigate(['/user', user.id], { queryParams: { editing: true } });
          }

          this.snackBar.notifyLoginSuccessful(user.displayName);
        },
        e => this.snackBar.notifyLoginFailed()
      );
  }

  logout() {
    this.authService.signOut().subscribe(_ => {
      this.router.navigate(['/']);
      this.snackBar.notifyLogoutSuccessful();
    });
  }
}
