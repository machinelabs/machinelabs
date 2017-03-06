import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Lab } from './models/lab';
import { LabStorageService } from './lab-storage.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LabResolver implements Resolve<Lab> {

  constructor(private labStorageService: LabStorageService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // if we don't have any param, create a default lab
    // if we have an id, fetch the lab. If it fails, go for the default lab
    return !route.params['labid']
            ? this.labStorageService.createLab()
            : this.labStorageService.getLab(route.params['labid'])
                                    .map(lab => lab ? lab : this.labStorageService.createLab());

  }
}
