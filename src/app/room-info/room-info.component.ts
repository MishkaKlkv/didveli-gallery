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
import {RoomInfoService} from '../services/room-info.service';
import {AddEditRoomInfoDialogComponent} from './add-edit-room-info-dialog/add-edit-room-info-dialog.component';
import {tuiIsPresent} from '@taiga-ui/cdk';
import {Room} from '../../../app/model/room.schema';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomInfoComponent {

  readonly refreshRooms$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  readonly columns = [`index`, `roomNumber`, `owner`, `actions`];
  readonly size$ = new BehaviorSubject(10);
  readonly page$ = new BehaviorSubject(0);

  readonly total$ = this.refreshRooms$.pipe(
    switchMap(_ =>
      this.roomInfoService.getCount().pipe(
        filter(tuiIsPresent),
        startWith(1),
      )));

  readonly getAll$ = this.refreshRooms$.pipe(
    switchMap(_ =>
      combineLatest([
        this.page$,
        this.size$,
      ]).pipe(
        switchMap(query => this.getData(...query).pipe(startWith(null))),
        share(),
      )));

  readonly data$: Observable<readonly Room[]> = this.getAll$.pipe(
    filter(tuiIsPresent),
    map(rooms => rooms.filter(tuiIsPresent)),
    startWith([]),
  );

  constructor(private readonly roomInfoService: RoomInfoService,
              private readonly sharedService: SharedService,
              @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector) { }

  getData(page: number, size: number): Observable<ReadonlyArray<Room | null>> {
    const start = page * size;
    return this.roomInfoService.getAll(start, size);
  }

  add(): void {
    this.openAddEditRoomDialog('Add room');
  }

  update(room: Room): void {
    this.openAddEditRoomDialog('Edit room', room);
  }

  openAddEditRoomDialog(label: string, room: Room = new Room()) {
    this.dialogService.open<Room>(
      new PolymorpheusComponent(AddEditRoomInfoDialogComponent, this.injector),
      {
        label,
        data: room,
        size: `m`,
        dismissible: false
      },
    )
      .pipe(
        switchMap((res: Room) => res ? this.roomInfoService.save(res) : EMPTY)
      )
      .subscribe(() => this.refreshRooms$.next(true));
  }

  delete(room: Room): void {
    this.sharedService.initYesNoDialog(`delete ${room.roomNumber} room`)
      .pipe(
        switchMap((res: boolean) =>
          res ? this.roomInfoService.delete(room) : EMPTY
        ),
      ).subscribe((res: Room[]) => this.refreshRooms$.next(true));
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
