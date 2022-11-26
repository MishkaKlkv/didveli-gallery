import {ChangeDetectionStrategy, Component, Inject, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../../../app/model/booking.schema';
import {BehaviorSubject, EMPTY, Observable, switchMap, tap} from 'rxjs';
import {Charge} from '../../../../app/model/charge.schema';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {SharedService} from '../../shared/shared.service';
import {TuiDialogService} from '@taiga-ui/core';
import {ChargeService} from '../../services/charge.service';
import {AddEditOrderDialogComponent} from './add-edit-order-dialog/add-edit-order-dialog.component';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderInfoComponent implements OnInit {

  mode: string;
  id: number;
  total = 0;
  booking$: Observable<Booking>;
  readonly refreshCharges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  readonly columns = [`index`, `chargeName`, `price`, `quantity`, `subtotal`, `actions`];
  readonly options = {updateOn: `blur`} as const;

  constructor(private route: ActivatedRoute,
              private bookingService: BookingService,
              private chargeService: ChargeService,
              private readonly sharedService: SharedService,
              @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector) {
    this.route.params.subscribe(params => {
      this.mode = params.mode;
      this.id = +params.id;
    });
  }

  ngOnInit(): void {
    this.booking$ = this.refreshCharges$.pipe(
      switchMap(_ =>
        this.bookingService.getById(this.id)
          .pipe(
            tap((res: Booking) => {
              this.total = this.chargeService.calcTotal(res.charges);
            })
          )));
  }

  add(): void {
    this.openAddEditOrderDialog('Add service');
  }

  update(charge: Charge): void {
    this.openAddEditOrderDialog('Edit service', charge);
  }

  delete(charge: Charge): void {
    this.sharedService.initYesNoDialog(`delete service ${charge.chargeName} with quantity: ${charge.quantity}`)
      .pipe(
        switchMap((res: boolean) =>
          res ? this.chargeService.delete(charge) : EMPTY
        ),
      ).subscribe((res: Charge[]) => this.refreshCharges$.next(true));
  }

  openAddEditOrderDialog(label: string, charge: Charge = new Charge()) {
    this.dialogService.open<Charge>(
      new PolymorpheusComponent(AddEditOrderDialogComponent, this.injector),
      {
        label,
        data: charge,
        size: `m`,
        dismissible: false
      },
    )
      .pipe(
        switchMap((res: Charge) => {
          if (res) {
            res.bookingId = res.bookingId ?? this.id;
            return this.chargeService.save(res);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe(() => this.refreshCharges$.next(true));
  }

  getSubtotal({price, quantity}: Charge): number {
    return price * quantity;
  }
}
