import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-property-description',
  templateUrl: './property-description.component.html',
  styleUrl: './property-description.component.css'
})
export class PropertyDescriptionComponent implements OnInit {
  userID: string | null = localStorage.getItem('userID');
  loggedInUser: any;
  token: string | null = localStorage.getItem('token');
  property: any = {};
  propertyID: any;
  isOwner: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.userID) {
      // Make an HTTP GET request to fetch user details based on userID
      this.http.get<any>('http://localhost:3002/users/userbyid?userId='+ this.userID)
        .subscribe(
          (user) => {
            this.loggedInUser = user;
            
          },
          (error) => {
            console.error('Error fetching user details:', error);
            // Handle error, show an error message, etc.
          }
        );
    }
    // Get the property ID from the query parameters
    this.route.queryParams.subscribe(params => {
      this.propertyID = params['propertyID'];

      // Make an HTTP GET request to fetch property details
      this.http.get<any>('http://localhost:3002/properties/propertybyid?propertyID=' + this.propertyID, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        }),
      })
      .subscribe(
        (response) => {
          this.property = response[0];
          this.checkOwnership(); 
        },
        (error) => {
          console.error('Error fetching property details:', error);
          // Handle error, show an error message, etc.
        }
      );
    });
  }
  checkOwnership(): void {
    // Check if logged-in user's email matches the owner's email
    if (this.loggedInUser && this.property.owner === this.loggedInUser.email) {
      this.isOwner = true;
    }
  }
}
