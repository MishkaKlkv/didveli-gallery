import { Injectable } from '@angular/core';
import {IpcRenderer} from 'electron';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Booking} from '../../../app/model/booking.schema';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

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

  getAll(skip: number, take: number): Observable<Booking[]> {
    return of(this.ipc.sendSync('get-bookings', skip, take)).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }

  save(booking: Booking): Observable<Booking[]> {
    return of(
      this.ipc.sendSync('add-booking', booking)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  delete(booking: Booking): Observable<Booking[]> {
    return of(
      this.ipc.sendSync('delete-booking', booking)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  getCount(): Observable<number> {
    return of(this.ipc.sendSync('count-bookings')).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }
}
