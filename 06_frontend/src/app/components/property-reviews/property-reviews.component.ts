import { Component,OnInit  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-reviews',
  templateUrl: './property-reviews.component.html',
  styleUrl: './property-reviews.component.css'
})
export class PropertyReviewsComponent implements OnInit{
  propertyID: string | null = null;
  token: string | null = localStorage.getItem('token');
  reviews: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPropertyIDFromRoute();
  }

  getPropertyIDFromRoute(): void {
    this.route.queryParams.subscribe(params => {
      this.propertyID = params['propertyID'];
      if (this.propertyID) {
        this.fetchReviews();
      }
    });
  }

  fetchReviews(): void {
    if (!this.propertyID) {
      console.error('Property ID not provided');
      return;
    }

    this.http.get<any>(`http://localhost:3002/reviews/getreviewbypropertyid?propertyID=${this.propertyID}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      })
    }).subscribe(
      (response) => {
        this.reviews = response;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  onSubmit(rating: number, comment: string): void {
    if (!this.propertyID) {
      console.error('Property ID not provided');
      return;
    }

    const reviewData = {
      comment: comment,
      rating: rating
    };

    this.http.post<any>(`http://localhost:3002/reviews/postreview?propertyID=${this.propertyID}`, reviewData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      })
    }).subscribe(
      (response) => {
        console.log('Review posted successfully:', response);
        this.fetchReviews(); // Fetch reviews again after posting a new review
      },
      (error) => {
        console.error('Error posting review:', error);
      }
    );
  }
}
