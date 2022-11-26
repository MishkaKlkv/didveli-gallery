import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookingService} from '../../services/booking.service';
import {Observable} from 'rxjs';
import {Booking} from '../../entity/Booking';

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

  constructor(private route: ActivatedRoute,
              private bookingService: BookingService,) {
    this.route.params.subscribe(params => {
      this.mode = params.mode;
      this.id = +params.id;
    });
  }

  ngOnInit(): void {
  }

}
