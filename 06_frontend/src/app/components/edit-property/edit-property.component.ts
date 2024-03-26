import { Component,OnInit,ViewChild  } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SnackbarComponent } from '../snackbar/snackbar.component';


@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrl: './edit-property.component.css'
})
export class EditPropertyComponent implements OnInit {
  @ViewChild(SnackbarComponent, { static: true }) snackbarComponent!: SnackbarComponent;
  propertyID: any;
  token: string | null = localStorage.getItem('token');
  /** Form group for user profile edit form. */
  form: FormGroup = new FormGroup({});
  title:string=''
  price:null=null
  description:string=''
  /** Flag to indicate if the form has been submitted. */
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [''],
      description: [''],
      price: ['']
    });
    this.route.queryParams.subscribe(params => {
      this.propertyID = params['propertyID'];
      if (this.propertyID) {
        // Fetch property details based on propertyID
        this.http.get<any>(`http://localhost:3002/properties/propertybyid?propertyID=${this.propertyID}`, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          })
        }).subscribe(
          (response) => {
            this.form.patchValue({
              title: response[0].title,
              description: response[0].description,
              category: response[0].category,
              price: response[0].price
            });
          },
          (error) => {
            console.error('Error fetching property details:', error);
          }
        );
      }
    });
  }


  onSubmit(): void {
    if (this.form.invalid) {
      console.log('Form is invalid', this.form);
      return;
    }

    // Prepare data to send to the update API
  const updateData = {
    title: this.form.get('title')?.value,
    description: this.form.get('description')?.value,
    price: this.form.get('price')?.value
  };

    // Make the update API call
    this.http.put<any>(`http://localhost:3002/properties/updateproperty?propertyID=${this.propertyID}`, updateData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      })
    }).subscribe(
      (response) => {
        console.log('Update successful:', response);
        this.submitted = true;
        this.snackbarComponent.showEditSuccessMessage();
      },
      (error) => {
        console.error('Update failed:', error);
        // Handle error (if needed)
      }
    );
  }

}
