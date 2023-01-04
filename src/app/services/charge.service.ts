import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Charge} from '../entity/Charge';
import {IpcRendererService} from './ipc-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class ChargeService extends IpcRendererService {

  constructor() {
    super();
  }

  save(charge: Charge): Observable<Charge[]> {
    return of(
      this.ipc.sendSync('add-charge', charge)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  delete(charge: Charge): Observable<Charge[]> {
    return of(
      this.ipc.sendSync('delete-charge', charge)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

}
