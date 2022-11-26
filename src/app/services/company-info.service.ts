import { Injectable } from '@angular/core';
import {IpcRenderer} from 'electron';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Company} from "../entity/Company";

@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {

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

  getCompany(): Observable<Company> {
    return of(this.ipc.sendSync('get-company-info')).pipe(
      catchError((error: any) => throwError(error.json))
    );
  }

  save(company: Company): Observable<Company> {
    return of(
      this.ipc.sendSync('save-company-info', company)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }
}
