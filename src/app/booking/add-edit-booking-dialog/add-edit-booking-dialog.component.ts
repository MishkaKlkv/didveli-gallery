import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {DateHelper} from '../../shared/util/DateHelper';
import {ClientInfoService} from '../../services/client-info.service';
import {debounceTime, filter, Observable, startWith, Subject, switchMap} from 'rxjs';
import {RoomInfoService} from '../../services/room-info.service';
import {Client} from '../../../../app/model/client.schema';
import {Booking} from '../../../../app/model/booking.schema';
import {Room} from '../../../../app/model/room.schema';

@Component({
  selector: 'app-add-edit-booking-dialog',
  templateUrl: './add-edit-booking-dialog.component.html',
  styleUrls: ['./add-edit-booking-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditBookingDialogComponent implements OnInit {

  group: FormGroup = new FormGroup({});
  readonly booking: Booking = new Booking();
  readonly lessors = ['owner', 'administration'];
  readonly searchClient$: Subject<string | null> = new Subject();
  readonly searchRoom$: Subject<string | null> = new Subject();

  readonly clients$: Observable<readonly Client[] | null> = this.searchClient$.pipe(
    debounceTime(400),
    filter(value => value !== null),
    switchMap(search =>
      this.findClientByNameOrSurname(search).pipe(startWith<readonly Client[] | null>(null)),
    )
  );

  readonly rooms$: Observable<readonly Room[] | null> = this.searchRoom$.pipe(
    debounceTime(400),
    filter(value => value !== null),
    switchMap(search =>
      this.findRoomByRoomNumberOrOwner(search).pipe(startWith<readonly Room[] | null>(null)),
    )
  );

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Booking>,
              private readonly clientInfoService: ClientInfoService,
              private readonly roomInfoService: RoomInfoService,) {
  }

  get disabled() {
    return this.group.invalid;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    Object.assign(this.booking, this.context.data);
    this.group = new FormGroup({
      room: new FormControl(this.booking.room, Validators.required),
      client: new FormControl(this.booking.client, Validators.required),
      arrivalDate: new FormControl(DateHelper.tuiDayFromTimestamp(this.booking.arrivalDate), Validators.required),
      departureDate: new FormControl(DateHelper.tuiDayFromTimestamp(this.booking.departureDate)),
      lessor: new FormControl(this.booking.lessor),
      portal: new FormControl(this.booking.portal),
    });
  }

  onSearchClientChange(searchQuery: string | null): void {
    this.searchClient$.next(searchQuery);
  }

  onSearchRoomChange(searchQuery: string | null): void {
    this.searchRoom$.next(searchQuery);
  }

  extractValueFromEvent(event: Event): string | null {
    return (event.target as HTMLInputElement)?.value || null;
  }

  // todo абстрактный диалоговый класс
  ok() {
    Object.assign(this.booking, this.group.value);
    this.booking.arrivalDate = this.booking.arrivalDate?.valueOf();
    this.booking.departureDate = this.booking.departureDate?.valueOf();
    this.context.completeWith(this.booking);
  }

  cancel() {
    this.context.completeWith(null);
  }

  readonly stringifyClient = (item: Client): string =>
    `${item.name} ${item?.surname}`;

  readonly stringifyRoom = (item: Room): string =>
    `${item.roomNumber} | ${item.owner}`;

  private findClientByNameOrSurname(searchQuery: string | null): Observable<readonly Client[]> {
    return this.clientInfoService.findByNameOrSurname(searchQuery);
  }

  private findRoomByRoomNumberOrOwner(searchQuery: string | null): Observable<readonly Room[]> {
    return this.roomInfoService.findByRoomNumberOrOwner(searchQuery);
  }
}
