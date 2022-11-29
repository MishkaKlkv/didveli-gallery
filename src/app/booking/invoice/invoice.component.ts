import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookingService} from '../../services/booking.service';
import {Observable} from 'rxjs';
import {Booking} from '../../entity/Booking';
import {CompanyInfoService} from '../../services/company-info.service';
import {Company} from '../../entity/Company';
import {SafeUrl} from '@angular/platform-browser';
import {Charge} from '../../entity/Charge';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceComponent implements OnInit {

  mode: string;
  id: number;
  total = 0;
  booking$: Observable<Booking>;
  company$ = this.companyService.getCompany();

  constructor(private route: ActivatedRoute,
              private bookingService: BookingService,
              private companyService: CompanyInfoService,) {
    this.route.params.subscribe(params => {
      this.mode = params.mode;
      this.id = +params.id;
    });
  }

  ngOnInit(): void {
    this.booking$ = this.bookingService.getById(this.id);
  }

  getLogoLink(company: Company): SafeUrl {
    return this.companyService.getLogoLink(company);
  }

  getSubtotal({price, quantity}: Charge): number {
    return price * quantity;
  }

  print() {

    // window.print();


    // const printContent = document.getElementById("invoice");
    // const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write(printContent.innerHTML);
    // WindowPrt.document.close();
    // WindowPrt.focus();
    // WindowPrt.print();
    // WindowPrt.close();
  }
}
