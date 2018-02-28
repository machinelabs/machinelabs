import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { MenuTriggerType } from '../toolbar/toolbar-menu/toolbar-menu.component';
import { TOP_PICKS } from '../app.tokens';

import { LabStorageService } from '../lab-storage.service';
import { LabExecutionService } from '../lab-execution.service';
import { UserService } from '../user/user.service';

import { Lab } from '../models/lab';
import { Execution } from '../models/execution';
import { User } from '../models/user';

import { map } from 'rxjs/operators';

interface TopPickLab {
  lab: Lab;
  executions: Observable<Array<{ id: string, execution: Observable<Execution> }>>;
  user: Observable<User>;
}

@Component({
  selector: 'ml-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  MenuTriggerType = MenuTriggerType;

  topPicks: Observable<Array<TopPickLab>>;

  constructor(
    private labStorageService: LabStorageService,
    private userService: UserService,
    private labExecutionService: LabExecutionService,
    @Inject(TOP_PICKS) private topPicksIds) {}

  ngOnInit() {
    this.topPicks = forkJoin(
      this.labStorageService.getLab(this.topPicksIds[0]),
      this.labStorageService.getLab(this.topPicksIds[1]),
      this.labStorageService.getLab(this.topPicksIds[2]),
    ).pipe(
      map(labs => labs.filter(lab => !!lab)),
      map(labs => labs.map(lab => ({
        lab,
        executions: this.labExecutionService.observeRecentExecutionsForLab(lab),
        user: this.userService.getUser(lab.user_id)
      })))
    );
  }
}
