import {ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy} from '@angular/core';
import {ServiceInfoService} from '../services/service-info.service';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY, filter,
  map,
  Observable,
  share,
  startWith, Subject,
  switchMap, takeUntil
} from 'rxjs';
import {TuiDialogService} from '@taiga-ui/core';
import {SharedService} from '../shared/shared.service';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {AddEditServiceInfoDialogComponent} from './add-edit-service-info-dialog/add-edit-service-info-dialog.component';
import {tuiIsPresent} from '@taiga-ui/cdk';
import {Service} from "../entity/Service";

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.component.html',
  styleUrls: ['./service-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceInfoComponent implements OnDestroy {

  readonly columns = [`index`, `name`, `price`, `actions`];

  readonly destroy$: Subject<boolean> = new Subject<boolean>();
  readonly refreshServices$ = new BehaviorSubject<boolean>(true);
  readonly size$ = new BehaviorSubject(10);
  readonly page$ = new BehaviorSubject(0);

  readonly total$ = this.refreshServices$.pipe(
    switchMap(_ =>
      this.serviceInfoService.getCount().pipe(
        filter(tuiIsPresent),
        startWith(1),
      )));

  readonly getAll$ = this.refreshServices$.pipe(
    switchMap(_ =>
      combineLatest([
        this.page$,
        this.size$,
      ]).pipe(
        switchMap(query => this.getData(...query).pipe(startWith(null))),
        share(),
      )));

  readonly data$: Observable<readonly Service[]> = this.getAll$.pipe(
    filter(tuiIsPresent),
    map(services => services.filter(tuiIsPresent)),
    startWith([]),
  );

  constructor(private readonly serviceInfoService: ServiceInfoService,
              private readonly sharedService: SharedService,
              @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector) {
  }

  getData(page: number, size: number): Observable<ReadonlyArray<Service | null>> {
    const start = page * size;
    return this.serviceInfoService.getAll(start, size);
  }

  add(): void {
    this.openAddEditServiceDialog('Add service');
  }

  update(service: Service): void {
    this.openAddEditServiceDialog('Edit service', service);
  }

  openAddEditServiceDialog(label: string, service: Service = new Service()) {
    this.dialogService.open<Service>(
      new PolymorpheusComponent(AddEditServiceInfoDialogComponent, this.injector),
      {
        label,
        data: service,
        size: `m`,
        dismissible: false
      },
    )
      .pipe(
        switchMap((res: Service) =>
          res ? this.serviceInfoService.save(res) : EMPTY
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.refreshServices$.next(true));
  }

  delete(service: Service): void {
    this.sharedService.initYesNoDialog(`delete ${service.name} service`)
      .pipe(
        switchMap((res: boolean) =>
          res ? this.serviceInfoService.delete(service) : EMPTY
        ),
        takeUntil(this.destroy$)
      ).subscribe(() => this.refreshServices$.next(true));
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
