import { Component,ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild(SnackbarComponent, { static: true }) snackbarComponent!: SnackbarComponent;
  constructor(private http: HttpClient, private router: Router) { }

  login(userName: string, password: string) {
    // Log the form values to the console
    console.log('Username:', userName);
    console.log('password:', password);
    this.http.post<any>('http://localhost:3002/users/login', { userName, password })
      .subscribe(
        response => {
          // Login successful
          this.snackbarComponent.showSignupSuccessMessage();
          localStorage.setItem('token', response.token);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
          
        },
        error => {
          // Login failed
          console.error(error);
          // Display error message to the user
        }
      );
  }

}
