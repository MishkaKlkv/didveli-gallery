import { Injectable } from '@angular/core';
import {IpcRenderer} from 'electron';
import {map, Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Company} from '../entity/Company';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {

  // todo вынести в абстрактный сервис?
  private readonly ipc: IpcRenderer | undefined = void 0;

  constructor(private sanitizer: DomSanitizer,) {
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
      map(res => res || new Company()),
      catchError((error: any) => throwError(error.json))
    );
  }

  save(company: Company): Observable<Company> {
    return of(
      this.ipc.sendSync('save-company-info', company)
    ).pipe(catchError((error: any) => throwError(error.json)));
  }

  getLogoLink(company: Company): SafeUrl {
    const objectURL = `${company?.logo}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }
}
