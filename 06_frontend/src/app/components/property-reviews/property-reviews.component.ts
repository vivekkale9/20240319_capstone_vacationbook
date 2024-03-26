import { Component,OnInit  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-reviews',
  templateUrl: './property-reviews.component.html',
  styleUrl: './property-reviews.component.css'
})
export class PropertyReviewsComponent implements OnInit{
  userID: string | null = localStorage.getItem('userID');
  loggedInUser: any;
  propertyID: string | null = null;
  token: string | null = localStorage.getItem('token');
  reviews: any = {};
  isAuthor: boolean[] = [];
  rating:string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

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
        this.checkOwnership();
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  onSubmit( comment: string): void {
    if (!this.propertyID) {
      console.error('Property ID not provided');
      return;
    }

    const reviewData = {
      comment: comment,
      rating: this.rating
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

  checkOwnership(): void {
    // Check if logged-in user's email matches the owner's email for each review
    this.isAuthor = this.reviews.map((review: any) => {
      return review.author === this.loggedInUser.email;
    });
  }

  deleteReview(reviewID: string): void {
    this.http.delete<any>(`http://localhost:3002/reviews/deletereview?reviewID=${reviewID}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      })
    }).subscribe(
      (response) => {
        console.log('Review deleted successfully:', response);
        this.fetchReviews(); // Fetch reviews again after deleting a review
      },
      (error) => {
        console.error('Error deleting review:', error);
      }
    );
  }
}
