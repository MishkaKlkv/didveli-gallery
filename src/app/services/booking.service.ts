import { Injectable } from '@angular/core';
import {map, Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Booking} from '../entity/Booking';
import {Booking as BookingSchema} from '../../../app/model/booking.schema';
import {Client} from '../entity/Client';
import {IpcRendererService} from './ipc-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends IpcRendererService {

  constructor() {
    super();
  }

  getAll(skip: number, take: number, substr: string, mode: string = 'active'): Observable<Booking[]> {
    return of(this.ipc.sendSync('get-bookings', skip, take, this.isPassiveMode(mode), substr)).pipe(
      map((res: BookingSchema[]) =>
        res.map(entity => {
          const booking = Object.assign(new Booking(), entity);
          booking.client = Object.assign(new Client(), entity.client);
          return booking;
        })
      ),
      catchError((error: any) => throwError(error.json))
    );
  }

  getById(id: number): Observable<Booking> {
    return of(this.ipc.sendSync('get-booking-by-id', id)).pipe(
      map((res: BookingSchema) => {
        const booking = Object.assign(new Booking(), res);
        booking.client = Object.assign(new Client(), res.client);
        return booking;
      }),
      catchError((error: any) => throwError(error.json))
    );
  }

  getByClientId(clientId: number): Observable<Booking> {
    return of(this.ipc.sendSync('get-booking-by-client-id', clientId)).pipe(
      map((res: BookingSchema) => {
        if (res) {
          const booking = Object.assign(new Booking(), res);
          booking.client = Object.assign(new Client(), res.client);
          return booking;
        } else {
          return null;
        }
      }),
      catchError((error: any) => throwError(error.json))
    );
  }

  getByRoomId(roomId: number): Observable<Booking | null> {
    return of(this.ipc.sendSync('get-booking-by-room-id', roomId)).pipe(
      map((res: BookingSchema) => {
        if (res) {
          const booking = Object.assign(new Booking(), res);
          booking.client = Object.assign(new Client(), res.client);
          return booking;
        } else {
          return null;
        }
      }),
      catchError((error: any) => throwError(error.json))
    );
  }

  save(booking: Booking): Observable<Booking[]> {
    return of(
      this.ipc.sendSync('add-booking', booking.toDto())
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  delete(booking: Booking): Observable<Booking[]> {
    return of(
      this.ipc.sendSync('delete-booking', booking.toDto())
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  getCount(mode: string = 'active'): Observable<number> {
    return of(this.ipc.sendSync('count-bookings', this.isPassiveMode(mode))).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }

  private isPassiveMode(mode: string) {
    return mode === 'passive';
  }
}
