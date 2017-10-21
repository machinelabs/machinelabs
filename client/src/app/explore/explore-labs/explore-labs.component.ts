import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { LabExecutionService } from '../../lab-execution.service';
import { LabStorageService } from '../../lab-storage.service';
import { UserService } from '../../user/user.service';

import { Lab } from '../../models/lab';
import { Execution } from '../../models/execution';
import { User } from '../../models/user';

import { MasonryComponent } from '../../shared/masonry/masonry.component';

import { map } from 'rxjs/operators';

interface RecentLab {
  lab: Lab;
  executions: Observable<Array<{ id: string, execution: Observable<Execution> }>>;
  user: Observable<User>;
}

@Component({
  selector: 'ml-explore-labs',
  templateUrl: './explore-labs.component.html',
  styleUrls: ['./explore-labs.component.scss']
})
export class ExploreLabsComponent implements OnInit {

  @ViewChild(MasonryComponent) masonry: MasonryComponent;

  recentLabs$: Observable<Array<RecentLab>>;

  constructor(
    private labExecutionService: LabExecutionService,
    private labStorageService: LabStorageService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.recentLabs$ = this.getRecentLabs();
  }

  viewExecution(execution: Execution) {
    this.router.navigate(['/editor', execution.lab.id, execution.id]);
  }

  private getRecentLabs() {
    return this.labStorageService.getRecentLabs().pipe(
      map(labs => labs.map(lab => ({
        lab,
        executions: this.observeRecentExecutionsForLab(lab),
        user: this.userService.getUser(lab.user_id)
      })))
    );
  }

  private observeRecentExecutionsForLab(lab: Lab, limit = 3) {
    return this.labExecutionService.observeExecutionsForLab(lab).pipe(
      map(executions => executions.slice(0, limit))
    );
  }
}
