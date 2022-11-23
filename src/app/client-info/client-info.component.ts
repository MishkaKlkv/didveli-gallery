import {ChangeDetectionStrategy, Component, Inject, Injector} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  filter, map,
  Observable,
  share,
  startWith,
  switchMap
} from 'rxjs';
import {SharedService} from '../shared/shared.service';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {ClientInfoService} from '../services/client-info.service';
import {AddEditClientInfoDialogComponent} from './add-edit-client-info-dialog/add-edit-client-info-dialog.component';
import {tuiIsPresent} from '@taiga-ui/cdk';
import {Client} from '../../../app/model/client.schema';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientInfoComponent {

  readonly refreshClients$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  readonly columns = [`index`, `name`, `surname`, `passport`, `passportDate`, `citizenship`, `actions`];
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
    this.sharedService.initYesNoDialog(`delete ${client.name} ${client.surname} client`)
      .pipe(
        switchMap((res: boolean) =>
          res ? this.clientInfoService.delete(client) : EMPTY
        ),
      ).subscribe((res: Client[]) => this.refreshClients$.next(true));
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
        switchMap((res: Client) => res ? this.clientInfoService.save(res) : EMPTY)
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

}
