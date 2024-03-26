import { Component,OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit{
  @ViewChild(SnackbarComponent, { static: true }) snackbarComponent!: SnackbarComponent;
  token: string | null = localStorage.getItem('token');
  userName:string = ''
  email:string=''

  /** User ID extracted from the token */
  userId: string | null = localStorage.getItem('userID');

  /** Form group for user profile edit form. */
  form: FormGroup = new FormGroup({});

  /** Flag to indicate if the form has been submitted. */
  submitted = false;

  constructor(private formBuilder: FormBuilder,private http: HttpClient,private router: Router) {}

  /** Lifecycle hook called after component initialization. */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: [
        '',
        [],
      ],
      mobileNumber: [
        '',
        [
        ],
      ],
      email: ['', []],
      gender: [''],
    });

    const userId = localStorage.getItem("userID")
    this.http.get(`http://localhost:3002/users/userbyid?userId=${userId}`).subscribe({
      next:(response:any)=>{
        this.userName = response.userName
        this.email = response.email

      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }

  /**
   * Getter method to access form controls.
   * @returns Object containing form controls.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /** Function to handle form submission. */
  onSubmit(): void {
    this.submitted = true;
    console.log('Submit button clicked');

    if (this.form.invalid) {
      console.log('Form is invalid',this.form);
      return;
    }

    console.log('Form is valid. Submitting...');
    // Prepare the data to send to the update API
    const updateData = {
      userName: this.f['userName'].value,
      mobileNumber: this.f['mobileNumber'].value,
      email: this.f['email'].value,
      gender: this.f['gender'].value,
    };

    // Make the update API call
    this.http
      .put<any>(`http://localhost:3002/users/updateuser?userId=${this.userId}`, updateData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        }),
      })
      .subscribe(
        (response) => {
          console.log('Update successful:', response);
          this.snackbarComponent.showEditSuccessMessage();
        },
        (error) => {
          console.error('Update failed:', error);
          // Handle error (if needed)
        }
      );
  }

  /** Function to reset the form. */
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
