import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LabExecutionService } from '../lab-execution.service';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Injectable()
export class HasExecutionGuard implements CanActivate {

  constructor(
    private router: Router,
    private labExecutionService: LabExecutionService,
    private route: ActivatedRoute
  ) {}

  // The only purpose of this guard is to ensure that an execution id is attached
  // to the URL if one exists. We're using a guard so we can prevent the activation
  // of the editor and redirect with an execution id if one exists but is missing
  // in the URL.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const labId = route.paramMap.get('id');
    const executionId = route.paramMap.get('executionId');

    // If we don't have an execution id in the URL, check for the latest available
    // execution for this lab and redirect to the lab including the execution id.
    // If no execution exists, simply activate the component. This means that we're
    // navigating to a lab that simply hasn't been executed yet.
    return this.labExecutionService
        .getLatestExecutionIdForLab(labId)
        .map(executionId => {
          if (!executionId) {
            return true
          }
          this.router.navigate(['/editor', labId, executionId], {
            queryParamsHandling: 'merge',
            relativeTo: this.route
          });
        });
  }
}
