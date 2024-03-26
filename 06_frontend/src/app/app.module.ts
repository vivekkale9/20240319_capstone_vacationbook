import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignupComponent } from './components/signup/signup.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LandingPageFiltersComponent } from './components/landing-page-filters/landing-page-filters.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { AddPropertyComponent } from './components/add-property/add-property.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PropertyDescriptionComponent } from './components/property-description/property-description.component';
import { PropertyReviewsComponent } from './components/property-reviews/property-reviews.component';
import { PropertyMapComponent } from './components/property-map/property-map.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    SignupComponent,
    LandingPageComponent,
    LandingPageFiltersComponent,
    SnackbarComponent,
    AddPropertyComponent,
    DropdownComponent,
    EditProfileComponent,
    PropertyDescriptionComponent,
    PropertyReviewsComponent,
    PropertyMapComponent,
    PropertyDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
  ],
  providers: [SnackbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
