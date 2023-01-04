import {Injectable} from '@angular/core';
import {map, Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Client} from '../entity/Client';
import {Client as ClientSchema} from '../../../app/model/client.schema';
import {IpcRendererService} from './ipc-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class ClientInfoService extends IpcRendererService {

  constructor() {
    super();
  }

  getAll(skip: number, take: number): Observable<Client[]> {
    return of(this.ipc.sendSync('get-clients', skip, take)).pipe(
      map((res: ClientSchema[]) =>
        res.map(entity => Object.assign(new Client(), entity))
      ),
      catchError((error: any) => throwError(error.json))
    );
  }

  findByNameOrSurname(substr: string): Observable<Client[]> {
    return of(this.ipc.sendSync('get-clients-by-name-or-surname', substr)).pipe(
      map((res: ClientSchema[]) =>
        res.map(entity => Object.assign(new Client(), entity))
      ),
      catchError((error: any) => throwError(error.json))
    );
  }

  save(client: Client): Observable<Client[]> {
    return of(
      this.ipc.sendSync('add-client', client.toDto())
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  delete(client: Client): Observable<Client[]> {
    return of(
      this.ipc.sendSync('delete-client', client.toDto())
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  getCount(): Observable<number> {
    return of(this.ipc.sendSync('count-clients')).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }
}
