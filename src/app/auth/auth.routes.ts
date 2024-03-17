import { Routes } from "@angular/router";
import { loginGuardCanActivate } from "../core/route-guards/login.guard";
import { LoginComponent } from "./login/login.component";

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [loginGuardCanActivate]
   },
];