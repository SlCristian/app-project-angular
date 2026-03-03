import { FEATURES_ROUTES } from './features/routes/features.routes';

import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/error/page-not-found/page-not-found.component';
import { LoginComponent } from './core/auth/login/login.component';

export const routes: Routes = [
  {
  path:"home",
  loadChildren:()=>import("./features/routes/features.routes").then((m)=>m.FEATURES_ROUTES)
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path:"login",
    loadComponent:()=>import("./core/auth/login/login.component").then(m=>m.LoginComponent)
  },
  {
path:"",
pathMatch:"full",
redirectTo:"home"
  },
  {
       path: '**',
    redirectTo: '/404',
    pathMatch:"full"
  }
];
