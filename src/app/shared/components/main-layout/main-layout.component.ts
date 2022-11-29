import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CompanyInfoService} from '../../../services/company-info.service';
import {Company} from '../../../entity/Company';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {

  readonly tabs = [
    {
      name: 'Active room',
      link: 'booking/active',
      icon: 'active-room.svg',
    },
    {
      name: 'Passive room',
      link: 'booking/passive',
      icon: 'passive-room.svg',
    },
    {
      name: 'Client info',
      link: 'clients',
      icon: 'client.svg',
    },
    {
      name: 'Service info',
      link: 'services',
      icon: 'service.svg',
    },
    {
      name: 'Room info',
      link: 'rooms',
      icon: 'room.svg',
    },
    {
      name: 'Company info',
      link: 'company',
      icon: 'company.svg' ,
    }
  ];

  //todo fix error
  readonly company$ = this.companyService.getCompany();

  constructor(private sanitizer: DomSanitizer,
              private readonly companyService: CompanyInfoService,) { }

  buildLink(iconName: string) {
    return `assets/icons/${iconName}`;
  }

  getLogoLink(company: Company): SafeUrl {
    return this.companyService.getLogoLink(company);
  }

}
