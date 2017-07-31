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
export class HasValidExecutionGuard implements CanActivate {

  constructor(
    private router: Router,
    private labExecutionService: LabExecutionService,
    private route: ActivatedRoute
  ) {}

  // The only purpose of this guard is to ensure that an execution id is attached
  // to the URL if one exists. We're using a guard so we can prevent the activation
  // of the editor and redirect with an execution id if one exists but is missing
  // in the URL.
  canActivate(route: ActivatedRouteSnapshot) {
    const labId = route.paramMap.get('id');
    const executionId = route.paramMap.get('executionId');


    // If we don't have an execution id in the URL, check for the latest available
    // execution for this lab and redirect to the lab including the execution id.
    // If no execution exists, simply activate the component. This means that we're
    // navigating to a lab that simply hasn't been executed yet.
    const checkForLatestExecution$ = this.labExecutionService
                      .getLatestVisibleExecutionIdForLab(labId)
                      .do(_executionId => {
                        if (_executionId) {
                          this.router.navigate(['/editor', labId, _executionId], {
                            queryParamsHandling: 'merge'
                          });
                        } else {
                          this.router.navigate(['/editor', labId], {
                            queryParamsHandling: 'merge'
                          });
                        }
                      })
                      // This is only to satisfy the guard API. Technically,
                      // we never really end up here as we've redirected at
                      // this point already
                      .map(_executionId => !_executionId);

    return !executionId ?
      checkForLatestExecution$ :
      this.labExecutionService.executionExists(executionId)
        .switchMap(exists => exists ? Observable.of(true) : checkForLatestExecution$);
  }
}
