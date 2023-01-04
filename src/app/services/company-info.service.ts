import { Injectable } from '@angular/core';
import {map, Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Company} from '../entity/Company';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {IpcRendererService} from './ipc-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService extends IpcRendererService {

  constructor(private sanitizer: DomSanitizer) {
    super();
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
