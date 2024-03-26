import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  listings: any[] = [];
  listingsToDisplay: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch default listings
    this.fetchDefaultListings();
  }

  fetchDefaultListings() {
    // Make an HTTP GET request to fetch default listings when the component initializes
    this.http.get<any[]>('http://localhost:3002/properties/allproperties')
      .subscribe(
        (response) => {
          this.listings = response;
          this.listingsToDisplay = this.listings;
        },
        (error) => {
          console.error('Error fetching default listings:', error);
          // Handle error, show an error message, etc.
        }
      );
  }

  handleSearchResults(results: any[]) {
    // Update listingsToDisplay with search results
    this.listingsToDisplay = results;
    console.log("handling the search results");
    console.log(this.listingsToDisplay);
  }

  handleFilterSelected(category: string) {
    // Filter listings based on the selected category
    this.listingsToDisplay = this.listings.filter(listing => listing.category === category);
    console.log(category);
    
    console.log("filtering");
    console.log(this.listingsToDisplay);
    
  }
}
