import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Service} from '../../entity/Service';

@Component({
  selector: 'app-add-edit-service-info-dialog',
  templateUrl: './add-edit-service-info-dialog.component.html',
  styleUrls: ['./add-edit-service-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditServiceInfoDialogComponent implements OnInit{

  group: FormGroup = new FormGroup({});
  service: Service = new Service();

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Service>) { }

  get disabled() {
    return this.group.invalid;
  }

  ngOnInit(): void {
    Object.assign(this.service, this.context.data);
    this.group = new FormGroup({
      name: new FormControl(this.service.name, Validators.required),
      price: new FormControl(this.service.price, Validators.required),
    });
  }

  ok() {
    Object.assign(this.service, this.group.value);
    this.context.completeWith(this.service);
  }

  cancel() {
    this.context.completeWith(null);
  }
}
