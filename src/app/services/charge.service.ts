import { Injectable } from '@angular/core';
import {IpcRenderer} from 'electron';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Charge} from '../../../app/model/charge.schema';

@Injectable({
  providedIn: 'root'
})
export class ChargeService {

  // todo вынести в абстрактный сервис?
  private readonly ipc: IpcRenderer | undefined = void 0;

  constructor() {
    if (window.require) {
      try {
        this.ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
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

  calcTotal(charges: Charge[]) {
    return charges.reduce(
      (accumulator, charge) => {
        if (charge.chargeName === 'Deposit') {
          return accumulator - (charge.price * charge.quantity);
        } else {
          return accumulator + (charge.price * charge.quantity);
        }
      }, 0
    );
  }
}
