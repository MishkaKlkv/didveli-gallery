import {NgDompurifySanitizer} from '@tinkoff/ng-dompurify';
import {TUI_SANITIZER} from '@taiga-ui/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';

import {AppComponent} from './app.component';
import {ServiceInfoComponent} from './service-info/service-info.component';
import {RoomInfoComponent} from './room-info/room-info.component';
import {TaigaModule} from './taiga.module';
import {
  AddEditServiceInfoDialogComponent
} from './service-info/add-edit-service-info-dialog/add-edit-service-info-dialog.component';
import {
  AddEditRoomInfoDialogComponent
} from './room-info/add-edit-room-info-dialog/add-edit-room-info-dialog.component';
import {ClientInfoComponent} from './client-info/client-info.component';
import {
  AddEditClientInfoDialogComponent
} from './client-info/add-edit-client-info-dialog/add-edit-client-info-dialog.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { BookingComponent } from './booking/booking.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { AddEditBookingDialogComponent } from './booking/add-edit-booking-dialog/add-edit-booking-dialog.component';
import { OrderInfoComponent } from './booking/order-info/order-info.component';
import { AddEditOrderDialogComponent } from './booking/order-info/add-edit-order-dialog/add-edit-order-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ServiceInfoComponent,
    RoomInfoComponent,
    AddEditServiceInfoDialogComponent,
    AddEditRoomInfoDialogComponent,
    ClientInfoComponent,
    AddEditClientInfoDialogComponent,
    BookingComponent,
    CompanyInfoComponent,
    AddEditBookingDialogComponent,
    OrderInfoComponent,
    AddEditOrderDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    TaigaModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
