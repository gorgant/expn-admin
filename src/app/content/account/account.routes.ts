import { Routes } from "@angular/router";
import { AccountComponent } from "./account.component";
import { AdminAppRoutes } from "../../../../shared-models/routes-and-paths/app-routes.model";

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AccountComponent
  },
];