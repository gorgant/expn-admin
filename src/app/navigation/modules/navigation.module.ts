import { NgModule } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent],
  imports: [
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
  ]
})
export class NavigationModule { }
