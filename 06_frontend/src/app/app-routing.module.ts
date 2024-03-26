import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AddPropertyComponent } from './components/add-property/add-property.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { EditPropertyComponent } from './components/edit-property/edit-property.component';

const routes: Routes = [
  {
    path : '',
    component : LandingPageComponent
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : 'signup',
    component : SignupComponent
  },
  {
    path : 'addproperty',
    component : AddPropertyComponent
  },
  {
    path : 'editprofile',
    component : EditProfileComponent
  },
  {
    path : 'propertydetails',
    component : PropertyDetailsComponent
  },
  {
    path : 'editproperty',
    component : EditPropertyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
