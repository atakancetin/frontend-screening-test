import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { AuthGuard } from 'src/guards/auth.guard';
const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "login", component: LoginComponent },
  { path: "welcome", component: WelcomeComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
