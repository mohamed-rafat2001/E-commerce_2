import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AllProductComponent } from './views/product/all-product/all-product.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  //NAV-BAR
  { path: 'singUp', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  //Views
  { path: '', component: AllProductComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
