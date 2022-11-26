import {Injectable} from '@angular/core';
import {IpcRenderer} from 'electron';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Client} from '../entity/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientInfoService {

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

  getAll(skip: number, take: number): Observable<Client[]> {
    return of(this.ipc.sendSync('get-clients', skip, take)).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }

  findByNameOrSurname(substr: string): Observable<Client[]> {
    return of(this.ipc.sendSync('get-clients-by-name-or-surname', substr)).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }

  save(client: Client): Observable<Client[]> {
    return of(
      this.ipc.sendSync('add-client', client)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  delete(client: Client): Observable<Client[]> {
    return of(
      this.ipc.sendSync('delete-client', client)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  getCount(): Observable<number> {
    return of(this.ipc.sendSync('count-clients')).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }
}
