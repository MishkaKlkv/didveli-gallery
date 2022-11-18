import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanyInfoService} from '../services/company-info.service';
import {TuiAlertService} from '@taiga-ui/core';
import {Company} from '../../../app/model/company.schema';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent implements OnInit {

  group: FormGroup = new FormGroup({});
  isEditModeOn = false;
  company: Company = new Company();
  // todo попробовать
  // readonly company$ = this.companyService.getCompany()
  //   .pipe(
  //     map((res: Company) => Object.assign(this.company, res))
  //   );

  constructor(private readonly companyService: CompanyInfoService,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) { }

  get disabled() {
    return this.group.invalid || !this.isEditModeOn;
  }

  ngOnInit(): void {
    //todo unsubscribe
    this.companyService.getCompany().subscribe(res => {
      Object.assign(this.company, res);
      this.initGroup();
    });
  }

  initGroup() {
    this.group = new FormGroup({
      name: new FormControl(this.company.name, Validators.required),
      companyId: new FormControl(this.company.companyId, Validators.required),
      address: new FormControl(this.company.address, Validators.required),
      bank: new FormControl(this.company.bank, Validators.required),
      phone: new FormControl(this.company.phone, Validators.required),
      email: new FormControl(this.company.email, Validators.required),
      logo: new FormControl(null),
    });
    this.group.disable();
  }

  save() {
    //todo unsubscribe
    Object.assign(this.company, this.group.value);
    this.companyService.save(this.company).subscribe(res => {
        const notification = res ? 'Company info saved' : 'Error, try again';
        this.alertService.open(notification).subscribe();
      });
  }

  toggleForm() {
    this.group.disabled ? this.group.enable() : this.group.disable();
  }
}
