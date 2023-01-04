import {ChangeDetectionStrategy, Component, Inject, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanyInfoService} from '../services/company-info.service';
import {TuiAlertService} from '@taiga-ui/core';
import {Company} from '../entity/Company';
import {TuiFileLike} from '@taiga-ui/kit';
import {Observable, of, Subject, switchMap, takeUntil, tap} from 'rxjs';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent implements OnDestroy {

  group: FormGroup = new FormGroup({});
  isEditModeOn = false;
  selectedFile: string;
  loadedFiles$: Observable<TuiFileLike | null>;
  readonly destroy$: Subject<boolean> = new Subject<boolean>();

  readonly company$ = this.companyService.getCompany()
    .pipe(
      tap((company: Company) => {
        this.selectedFile = company.logo;
        this.group = new FormGroup({
          name: new FormControl(company.name, Validators.required),
          companyId: new FormControl(company?.companyId, Validators.required),
          address: new FormControl(company?.address, Validators.required),
          bank: new FormControl(company?.bank, Validators.required),
          phone: new FormControl(company?.phone, Validators.required),
          email: new FormControl(company?.email, Validators.required),
          logo: new FormControl(company?.logo
            ? new File([company.logo], company?.logoName, { type: 'image/png' })
            : null,
            Validators.required),
          logoName: new FormControl(company?.logoName, Validators.required),
        });
        this.loadedFiles$ = this.group.get('logo')?.valueChanges.pipe(
          switchMap(file => (file ? this.makeRequest(file) : of(null))),
        );
        this.group.disable();
      })
    );

  constructor(private readonly companyService: CompanyInfoService,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) { }

  get disabled() {
    return this.group.invalid || !this.isEditModeOn;
  }

  save(company: Company) {
    Object.assign(company, this.group.value);
    company.logo = this.selectedFile;
    this.companyService.save(company)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        const notification = res ? 'Company info saved' : 'Error, try again';
        this.alertService.open(notification).subscribe();
      });
  }

  toggleForm(): void {
    this.group.disabled ? this.group.enable() : this.group.disable();
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    const existedFile = new File([this.selectedFile], this.group.get('logoName')?.value, { type: 'image/png' });
    if (existedFile.name !== file.name && existedFile.size !== file.size) {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        this.selectedFile = base64data.toString();
      };
    }
    this.group.get('logoName')?.setValue(file.name);
    return of(file);
  }

  removeFile(): void {
    this.group.get('logo').setValue(null);
    this.group.get('logoName').setValue(null);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
