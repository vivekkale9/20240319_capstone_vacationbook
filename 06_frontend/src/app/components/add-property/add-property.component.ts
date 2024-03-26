import { Component } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css'
})
export class AddPropertyComponent {
  constructor(private http: HttpClient) {}
  token: string | null = localStorage.getItem('token');

  title: string = ''; // Assuming title is a string
  description: string = ''; // Assuming description is a string
  category: string = ''; // Assuming category is a string
  image: string | ArrayBuffer | null = null; // Base64-encoded image data
  price: number | null = null; // Assuming price is a number or null
  country: string = ''; // Assuming country is a string
  location: string = '';

  onSubmit() {
    const formData = {
      title : this.title,
      description: this.description,
      category : this.category,
      image : this.image,
      price : this.price,
      country : this.country,
      location : this.location
    }
    // formData.append('title', this.title);
    // formData.append('description', this.description);
    // formData.append('category', this.category);
    // formData.append('image', this.image!);
    // formData.append('price', this.price.toString());
    // formData.append('country', this.country);
    // formData.append('location', this.location);
    // Log the form values to the console
    console.log('Username:', this.title);
    console.log('Email:', this.category);
    console.log("img: ", this.image);
    
      
      // ... rest of your code
      this.http.post<any>('http://localhost:3002/properties/addproperty', formData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json', // Remove this if unnecessary
          Authorization: `Bearer ${this.token}`,
        }),
      })
      .subscribe(
        (response) => {
          console.log('Property added successfully:', response);
          // ... handle success
        },
        (error) => {
          try {
            const errorData = JSON.parse(error.error); // Attempt to parse as JSON
            console.error('Error adding property:', errorData.error);
            // Handle specific errors based on errorData.error
          } catch (parseError) {
            console.error('Failed to parse error response:', error);
            // Handle non-JSON error response generically
          }
        }
      );
    }
    onFileChange(event: Event): void {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.image = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

