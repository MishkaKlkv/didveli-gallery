import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Service} from '../../../app/model/service.schema';

@Injectable({
  providedIn: 'root'
})
export class ServiceInfoService {

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

  getAll(skip: number, take: number): Observable<Service[]> {
    return of(this.ipc.sendSync('get-services', skip, take)).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }

  save(service: Service): Observable<Service[]> {
    return of(
      this.ipc.sendSync('add-service', service)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  delete(service: Service): Observable<Service[]> {
    return of(
      this.ipc.sendSync('delete-service', service)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  getCount(): Observable<number> {
    return of(this.ipc.sendSync('count-services')).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }
}
