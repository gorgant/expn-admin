import { Routes } from "@angular/router";
import { SubscribersComponent } from "./subscribers.component";
import { AdminAppRoutes } from "../../../../shared-models/routes-and-paths/app-routes.model";

export const SUBSCRIBERS_ROUTES: Routes = [
  {
    path: '',
    component: SubscribersComponent
  },
  {
    path: AdminAppRoutes.SUBSCRIBERS.substring(1),
    component: SubscribersComponent
  },
];