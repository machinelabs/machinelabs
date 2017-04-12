import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';
import { Lab } from '../models/run';

import { LabStorageService } from '../lab-storage.service';
import { UserService } from '../user/user.service';

/**
 * User Profile Component <ml-user-profile>
 *
 * Displays profile information for logged in users
 */
@Component({
  selector: 'ml-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  labs: Observable<Array<Lab>>;
  user: User;
  isSelf = false;

  constructor(private route: ActivatedRoute,
              private labStorage: LabStorageService,
              private userService: UserService) {}

  ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.labs = this.route.snapshot.data['labs'];
    this.userService.observeUserChanges()
                    .switchMap(_ => this.userService.isLoggedInUser(this.user.id))
                    .subscribe(self => this.isSelf = self);
  }
}
