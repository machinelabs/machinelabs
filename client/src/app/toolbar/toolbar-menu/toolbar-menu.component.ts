import * as firebase from 'firebase';

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';
import { LoginService } from '../../login.service';
import { UserService } from '../../user/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'ml-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss']
})
export class ToolbarMenuComponent implements OnInit {

  user: Observable<User>;

  constructor(private userService: UserService,
              private loginService: LoginService) {}

  ngOnInit() {
    this.user = this.userService.observeUserChanges();
  }

  loginWithGitHub() {
    this.loginService.loginWithGitHub();
  }

  loginWithGoogle() {
    this.loginService.loginWithGoogle();
  }

  logout() {
    this.loginService.logout();
  }
}
