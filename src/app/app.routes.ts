import { Routes } from '@angular/router';
import { AdminAppRoutes } from '../../shared-models/routes-and-paths/app-routes.model';
import { authGuardCanActivate, authGuardCanLoad } from './core/route-guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: AdminAppRoutes.AUTH_LOGIN.slice(1),
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: AdminAppRoutes.ACCOUNT.slice(1),
    loadChildren: () => import('./content/account/account.routes').then(m => m.ACCOUNT_ROUTES),
    canLoad: [authGuardCanLoad],
    canActivate: [authGuardCanActivate]
  },
  {
    path: AdminAppRoutes.BLOG.slice(1),
    loadChildren: () => import('./content/blog/blog.routes').then(m => m.BLOG_ROUTES),
    canLoad: [authGuardCanLoad],
    canActivate: [authGuardCanActivate]
  },
  {
    path: AdminAppRoutes.SUBSCRIBERS.slice(1),
    loadChildren: () => import('./content/subscribers/subscribers.routes').then(m => m.SUBSCRIBERS_ROUTES),
    canLoad: [authGuardCanLoad],
    canActivate: [authGuardCanActivate]
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./content/blog/blog.routes').then(m => m.BLOG_ROUTES),
  //   canLoad: [authGuardCanLoad],
  //   canActivate: [authGuardCanActivate]
  // },
  {
    path: '**',
    redirectTo: AdminAppRoutes.BLOG.slice(1),
    pathMatch: 'full'
  },

];