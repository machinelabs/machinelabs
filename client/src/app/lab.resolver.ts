import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import { Lab } from './models/lab';
import { LabStorageService } from './lab-storage.service';
import { BLANK_LAB_TPL_ID, DEFAULT_LAB_TPL_ID } from './lab-template.service';

@Injectable()
export class LabResolver implements Resolve<Lab> {

  constructor(
    private labStorageService: LabStorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    if (route.paramMap.get('id')) {
      // If we have a lab id, try to fetch it and fall back to
      // a new empty lab if no lab with the given id exists.
      return this.labStorageService.getLab(route.paramMap.get('id')).pipe(
        tap(lab => {
          if (!lab || lab.hidden) {
            this.snackBar.open('This lab doesn\'t exist anymore', 'Dismiss', {
              duration: 3000
            });
            this.router.navigate(['/editor']);
          }
        })
      );
    }

    // If a template id is specified, create a lab from that template,
    // unless it's the blank template id. Since `queryParams['tpl']` can
    // be undefined, we can easily fallback to default lab template.
    return (route.queryParamMap.get('tpl') === BLANK_LAB_TPL_ID)
            ? this.labStorageService.createLab()
            : this.labStorageService.createLabFromTemplate(route.queryParamMap.get('tpl') || DEFAULT_LAB_TPL_ID);
  }
}
