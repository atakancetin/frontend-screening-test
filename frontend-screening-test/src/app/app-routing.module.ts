import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { WelcomeComponent } from '../welcome/welcome.component';
const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "login" },
  // { path: "**", pathMatch: "full", redirectTo: "login" }, 
  { path: "login", component: LoginComponent },
  { path: "welcome", component: WelcomeComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
