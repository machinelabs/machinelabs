import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { of } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';

import { LabExecutionService } from '../lab-execution.service';
import { LocationHelper } from '../util/location-helper';

@Injectable()
export class HasValidExecutionGuard implements CanActivate {
  constructor(
    private router: Router,
    private labExecutionService: LabExecutionService,
    private locationHelper: LocationHelper,
    private snackBar: MatSnackBar,
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
    const checkForLatestExecution$ = this.labExecutionService.getLatestVisibleExecutionIdForLab(labId).pipe(
      tap(_executionId => {
        const rootUrlSegment = this.locationHelper.getRootUrlSegment();
        const urlSegments = [`/${rootUrlSegment}`, labId];

        if (_executionId) {
          urlSegments.push(_executionId);
        }
        this.router.navigate(urlSegments, {
          queryParamsHandling: 'merge'
        });
      }),
      // This is only to satisfy the guard API. Technically,
      // we never really end up here as we've redirected at
      // this point already
      map(_executionId => !_executionId)
    );

    return !executionId
      ? checkForLatestExecution$
      : this.labExecutionService.executionExistsAndVisible(executionId).pipe(
          switchMap(exists => (exists ? of(true) : checkForLatestExecution$)),
          catchError(_ => {
            // TODO(pascal): Refactor this to use EditorSnackbarService once moved
            // into root module.
            this.snackBar.open("This lab doesn't exist anymore", 'Dismiss', {
              duration: 3000
            });
            this.router.navigate(['/editor']);
            return of(false);
          })
        );
  }
}
