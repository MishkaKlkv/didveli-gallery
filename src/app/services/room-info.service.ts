import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Room} from '../entity/Room';
import {IpcRendererService} from './ipc-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class RoomInfoService extends IpcRendererService {

  constructor() {
    super();
  }

  getAll(skip: number, take: number): Observable<Room[]> {
    return of(this.ipc.sendSync('get-rooms', skip, take)).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }

  findByRoomNumberOrOwner(substr: string): Observable<Room[]> {
    return of(this.ipc.sendSync('get-rooms-by-number-or-owner', substr)).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }

  save(room: Room): Observable<Room[]> {
    return of(
      this.ipc.sendSync('add-room', room)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  delete(room: Room): Observable<Room[]> {
    return of(
      this.ipc.sendSync('delete-room', room)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  getCount(): Observable<number> {
    return of(this.ipc.sendSync('count-rooms')).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }
}
