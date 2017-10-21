import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LoginService } from '../login.service';
import { UserService } from '../user/user.service';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ml-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private loginService: LoginService,
    private userService: UserService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.userService.observeUserChanges().pipe(
      map(user => !user.isAnonymous)
    );
  }

  login() {
    this.loginService.loginWithGitHub();
  }
}
