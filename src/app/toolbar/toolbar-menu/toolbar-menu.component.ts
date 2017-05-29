import { Component, Input, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'ml-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss']
})
export class ToolbarMenuComponent implements OnInit {

  user: Observable<User>;

  constructor(private authService: AuthService,
              private userService: UserService,
              private snackBar: MdSnackBar) {}

  ngOnInit() {
    this.user = this.userService.observeUserChanges();
  }

  loginWithGitHub() {
    this.authService.linkOrSignInWithGitHub()
                    .switchMap(loginUser => this.userService.createUserIfMissing())
                    .subscribe(user => {
      this.snackBar.open(`Logged in as ${user.displayName}`, 'Dismiss', { duration: 3000 });
    });
  }

  logout() {
    this.authService.signOut().subscribe(_ => {
      this.snackBar.open('Logged out successfully', 'Dismiss', { duration: 3000 });
    });
  }
}

