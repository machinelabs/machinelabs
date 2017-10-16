import { Directive, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User } from '../models/user';

@Component({
  selector: 'ml-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  private user: User;

  constructor(private authService: AuthService,
              private userService: UserService,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.userService.observeUserChanges()
                    .subscribe(user => this.user = user);
  }
}

@Component({
  selector: 'ml-toolbar-logo',
  template: '<img src="/assets/images/machinelabs_logo_white.svg" alt="MachineLabs, Inc.">',
  styleUrls: ['./toolbar-logo.component.scss']
})
export class ToolbarLogoComponent {}

/* tslint:disable:directive-selector */
@Directive({
  selector: 'ml-toolbar-content, [ml-toolbar-content]'
})
export class ToolbarContentDirective {}

@Directive({
  selector: 'ml-toolbar-cta-bar, [ml-toolbar-cta-bar]'
})
export class ToolbarCtaBarDirective {}
