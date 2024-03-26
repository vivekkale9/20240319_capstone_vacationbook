import { Component,ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild(SnackbarComponent, { static: true }) snackbarComponent!: SnackbarComponent;
  constructor(private http: HttpClient, private router: Router,private authService:AuthService) { }

  login(userName: string, password: string) {
    // Log the form values to the console
    console.log('Username:', userName);
    console.log('password:', password);
    this.http.post<any>('http://localhost:3002/users/login', { userName, password })
      .subscribe(
        response => {
          const token = response.token;
          const role = response.role
          const userID = response.userId
          this.authService.logIn()
          // Login successful
          this.snackbarComponent.showSignupSuccessMessage();
          if(token && role && userID){
            localStorage.setItem('token', token);
            localStorage.setItem('role',role)
            localStorage.setItem('userID',userID)
            // Navigate to the home page if the token is present
            if(role=='user')
            this.router.navigate(['/']);
            else{
              this.router.navigate(['/signup'])
            }
          } else {
            // Optionally handle the case where there's no token in the response
            console.log('No token received');
          }
        },
        error => {
          // Login failed
          console.error(error);
          // Display error message to the user
        }
      );
  }

}
