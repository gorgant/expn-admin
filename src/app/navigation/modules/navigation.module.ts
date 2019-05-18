import { NgModule } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { SharedModule } from '../../shared/shared.module';
import { FooterComponent } from '../components/footer/footer.component';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent, FooterComponent],
  imports: [
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
    FooterComponent
  ]
})
export class NavigationModule { }
