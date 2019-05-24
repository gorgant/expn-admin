import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/route-guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './auth/modules/auth.module#AuthModule'
  },
  {
    path: '',
    loadChildren: './content/modules/content.module#ContentModule',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  // {
  //   path: '**',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload',
    // scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
