import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {Lab} from '../models/lab';
import {LabStorageService} from './lab-storage.service';
import {Observable} from 'rxjs';

@Injectable()
export class LabResolver implements Resolve<Lab> {

  constructor(private labStorageService: LabStorageService) { }

  // if we don't have any param, create a default lab
  // if we have an id, fetch the lab. If it fails, go for the default lab
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<Lab> {
    let ls = this.labStorageService;
    let labID = route.params['id'];

    // !! getLab() should internally `createLabFromTemplate()`
    return !labID ? ls.createLabFromTemplate('XOR') : ls.getLab(labID).switchMap(lab =>{
      return ls.createLab(lab);
    });
  }
}
