import { Directive, Component, OnInit, Input } from '@angular/core';
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

  @Input() hasSubRow = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.userService.observeUserChanges()
                    .subscribe(user => this.user = user);
  }
}

/* tslint:disable:directive-selector */
@Directive({
  selector: 'ml-toolbar-content, [ml-toolbar-content]'
})
export class ToolbarContentDirective {}

@Directive({
  selector: 'ml-toolbar-cta-bar, [ml-toolbar-cta-bar]'
})
export class ToolbarCtaBarDirective {}
