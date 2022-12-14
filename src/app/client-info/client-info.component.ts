import {ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  filter, map,
  Observable,
  share,
  startWith, Subject,
  switchMap, takeUntil
} from 'rxjs';
import {SharedService} from '../shared/shared.service';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {ClientInfoService} from '../services/client-info.service';
import {AddEditClientInfoDialogComponent} from './add-edit-client-info-dialog/add-edit-client-info-dialog.component';
import {tuiIsPresent} from '@taiga-ui/cdk';
import {Client} from '../entity/Client';
import {Booking} from '../entity/Booking';
import {BookingService} from '../services/booking.service';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientInfoComponent implements OnDestroy {

  readonly columns = [`index`, `name`, `surname`, `passport`, `passportDate`, `citizenship`, `actions`];

  readonly destroy$: Subject<boolean> = new Subject<boolean>();
  readonly refreshClients$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  readonly size$ = new BehaviorSubject(10);
  readonly page$ = new BehaviorSubject(0);

  readonly total$ = this.refreshClients$.pipe(
    switchMap(_ =>
      this.clientInfoService.getCount().pipe(
        filter(tuiIsPresent),
        startWith(1),
      )));

  readonly getAll$ = this.refreshClients$.pipe(
    switchMap(_ =>
      combineLatest([
        this.page$,
        this.size$,
      ]).pipe(
        switchMap(query => this.getData(...query).pipe(startWith(null))),
        share(),
      )));

  readonly data$: Observable<readonly Client[]> = this.getAll$.pipe(
    filter(tuiIsPresent),
    map(clients => clients.filter(tuiIsPresent)),
    startWith([]),
  );

  constructor(private readonly clientInfoService: ClientInfoService,
              private bookingService: BookingService,
              private readonly sharedService: SharedService,
              @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector) {
  }

  getData(page: number, size: number): Observable<ReadonlyArray<Client | null>> {
    const start = page * size;
    return this.clientInfoService.getAll(start, size);
  }

  add(): void {
    this.openAddEditClientDialog('Add client');
  }

  update(client: Client): void {
    this.openAddEditClientDialog('Edit client', client);
  }

  delete(client: Client): void {
    this.bookingService.getByClientId(client.id).pipe(
      switchMap(
        (booking: Booking) => booking
          ? this.sharedService.initInfoDialog(`Client ${client.name} ${client.surname} is used in booking. Delete booking first`)
          : this.sharedService.initYesNoDialog(`delete ${client.name} ${client.surname} client`)
      ),
      switchMap(
        (res: boolean) => res ? this.clientInfoService.delete(client) : EMPTY
      ),
      takeUntil(this.destroy$)
    ).subscribe(() => this.refreshClients$.next(true));
  }

  openAddEditClientDialog(label: string, client: Client = new Client()) {
    this.dialogService.open<Client>(
      new PolymorpheusComponent(AddEditClientInfoDialogComponent, this.injector),
      {
        label,
        data: client,
        size: `m`,
        dismissible: false
      },
    )
      .pipe(
        switchMap((res: Client) => res ? this.clientInfoService.save(res) : EMPTY),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.refreshClients$.next(true));
  }

  trackByFn(index) {
    return index;
  }

  onSize(size: number): void {
    this.size$.next(size);
  }

  onPage(page: number): void {
    this.page$.next(page);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
