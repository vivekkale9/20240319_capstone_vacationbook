import { Component,ViewChild,AfterViewInit   } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements AfterViewInit{
  @ViewChild(SnackbarComponent, { static: true }) snackbarComponent!: SnackbarComponent;
  constructor(private http: HttpClient, private router: Router){}

  userName: string = '';
  email: string = '';
  mobileNumber: number = 0;
  password: string = '';
  gender: string = '';

  ngAfterViewInit(): void {
    // Ensure snackbarComponent is initialized before using it
    this.snackbarComponent = this.snackbarComponent;
  }

  onContinueClick(): void {

    // Log the form values to the console
    console.log('Username:', this.userName);
    console.log('Email:', this.email);
    console.log('Phone Number:', this.mobileNumber);
    console.log('Password:', this.password);

    this.http.post('http://localhost:3002/users/signup', {
      userName: this.userName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      password: this.password,
      gender: this.gender
    })
    .subscribe(
      (response) => {
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
        // this.snackbarComponent.showSignupSuccessMessage();
        // Handle the response from the backend
        console.log('Response:', response);
      },
      (error) => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
      }
    );
    
  }
}
