import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {Charge} from '../../../../../app/model/charge.schema';
import {ServiceInfoService} from '../../../services/service-info.service';
import {Service} from '../../../../../app/model/service.schema';

@Component({
  selector: 'app-add-edit-order-dialog',
  templateUrl: './add-edit-order-dialog.component.html',
  styleUrls: ['./add-edit-order-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditOrderDialogComponent implements OnInit {

  group: FormGroup = new FormGroup({});
  charge = new Charge();
  services$ = this.serviceInfoService.getAll(0, 10000);

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Charge>,
              private serviceInfoService: ServiceInfoService) { }

  get disabled() {
    return this.group.invalid;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    Object.assign(this.charge, this.context.data);
    this.group = new FormGroup({
      chargeName: new FormControl(this.charge.chargeName, Validators.required),
      price: new FormControl(this.charge.price, Validators.required),
      quantity: new FormControl(this.charge.quantity || 1, Validators.required),
    });
  }

  ok() {
    Object.assign(this.charge, this.group.value);
    this.context.completeWith(this.charge);
  }

  cancel() {
    this.context.completeWith(null);
  }

  addDefaultService(item: Service) {
    this.group.get('price').setValue(item.price);
  }

  addCustomService() {
    this.group.get('price').setValue(null);
  }
}
