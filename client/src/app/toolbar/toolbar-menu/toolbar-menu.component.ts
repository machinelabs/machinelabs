import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';
import { LoginService } from '../../login.service';
import { UserService } from '../../user/user.service';
import { User } from '../../models/user';

export enum MenuTriggerType {
  LoginButton,
  MenuButton
}

@Component({
  selector: 'ml-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarMenuComponent implements OnInit {

  @Input() menuTrigger = MenuTriggerType.MenuButton

  user: Observable<User>;

  MenuTriggerType = MenuTriggerType;

  constructor(private userService: UserService,
              private loginService: LoginService) {}

  ngOnInit() {
    this.user = this.userService.observeUserChanges();
  }

  loginWithGitHub() {
    this.loginService.loginWithGitHub();
  }

  logout() {
    this.loginService.logout();
  }
}

