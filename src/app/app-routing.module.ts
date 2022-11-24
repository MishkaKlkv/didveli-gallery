import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {ServiceInfoComponent} from './service-info/service-info.component';
import {RoomInfoComponent} from './room-info/room-info.component';
import {ClientInfoComponent} from './client-info/client-info.component';
import {BookingComponent} from './booking/booking.component';
import {CompanyInfoComponent} from './company-info/company-info.component';
import {OrderInfoComponent} from './booking/order-info/order-info.component';

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: 'booking/active', pathMatch: 'full'},
      {path: 'booking', children:
          [
            {path: 'active', component: BookingComponent},
            {path: 'passive', component: BookingComponent},
            {path: 'orders/:mode/:id', component: OrderInfoComponent}
          ]},
      {path: 'clients', component: ClientInfoComponent},
      {path: 'services', component: ServiceInfoComponent},
      {path: 'company', component: CompanyInfoComponent},
      {path: 'rooms', component: RoomInfoComponent},
      {path: '**', component: PageNotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'}),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
