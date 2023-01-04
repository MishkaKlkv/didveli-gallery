import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Service} from '../entity/Service';
import {IpcRendererService} from './ipc-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceInfoService extends IpcRendererService {

  constructor() {
    super();
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
