import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {Room} from '../../entity/Room';

@Component({
  selector: 'app-add-edit-room-info-dialog',
  templateUrl: './add-edit-room-info-dialog.component.html',
  styleUrls: ['./add-edit-room-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditRoomInfoDialogComponent implements OnInit {

  group: FormGroup = new FormGroup({});
  room: Room = new Room();

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Room>) {
  }

  get disabled() {
    return this.group.invalid;
  }

  ngOnInit(): void {
    Object.assign(this.room, this.context.data);
    this.group = new FormGroup({
      roomNumber: new FormControl(this.room.roomNumber, Validators.required),
      owner: new FormControl(this.room.owner, Validators.required),
      phone: new FormControl(this.room.phone),
    });
  }

  // // todo абстрактный диалоговый класс
  ok() {
    Object.assign(this.room, this.group.value);
    this.context.completeWith(this.room);
  }

  cancel() {
    this.context.completeWith(null);
  }

}
