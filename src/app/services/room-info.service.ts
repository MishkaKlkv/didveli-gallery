import { Injectable } from '@angular/core';
import {IpcRenderer} from 'electron';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Room} from '../entity/Room';

@Injectable({
  providedIn: 'root'
})
export class RoomInfoService {

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
