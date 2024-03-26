import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-property-description',
  templateUrl: './property-description.component.html',
  styleUrl: './property-description.component.css'
})
export class PropertyDescriptionComponent implements OnInit {
  token: string | null = localStorage.getItem('token');
  property: any = {};
  propertyID: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Get the property ID from the query parameters
    this.route.queryParams.subscribe(params => {
      this.propertyID = params['propertyID'];
      console.log(this.propertyID);

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
          
        },
        (error) => {
          console.error('Error fetching property details:', error);
          // Handle error, show an error message, etc.
        }
      );
    });
  }
}
