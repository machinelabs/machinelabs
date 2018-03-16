import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LabExecutionService } from '../../lab-execution.service';
import { LabStorageService } from '../../lab-storage.service';
import { UserService } from '../../user/user.service';

import { Lab } from '../../models/lab';
import { Execution } from '../../models/execution';
import { User } from '../../models/user';

import { map } from 'rxjs/operators';

interface RecentLab {
  lab: Lab;
  executions: Observable<Array<{ id: string; execution: Observable<Execution> }>>;
  user: Observable<User>;
}

@Component({
  selector: 'ml-explore-labs',
  templateUrl: './explore-labs.component.html',
  styleUrls: ['./explore-labs.component.scss']
})
export class ExploreLabsComponent implements OnInit {
  recentLabs$: Observable<Array<RecentLab>>;

  constructor(
    private labExecutionService: LabExecutionService,
    private labStorageService: LabStorageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.recentLabs$ = this.getRecentLabs();
  }

  private getRecentLabs() {
    return this.labStorageService.getRecentLabs().pipe(
      map(labs =>
        labs.map(lab => ({
          lab,
          executions: this.labExecutionService.observeRecentExecutionsForLab(lab),
          user: this.userService.getUser(lab.user_id)
        }))
      )
    );
  }
}
