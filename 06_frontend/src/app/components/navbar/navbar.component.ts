import { Component,Output, EventEmitter,OnInit,OnDestroy } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit,OnDestroy {
  isLoggedIn:Boolean = false
  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(loggedIn=>{
     this.isLoggedIn = loggedIn
   })
 }
  token: string | null = localStorage.getItem('token');
  searchText: string = '';
  @Output() searchResults: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private http: HttpClient,private authService:AuthService) {}

  searchProperties() {
    if (this.searchText.trim() === '') {
      // Handle empty search text
      return;
    }

    // Make HTTP request to search properties by name
    this.http.get<any[]>('http://localhost:3002/properties/searchbyname?propertyName=' + this.searchText,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // Remove this if unnecessary
        Authorization: `Bearer ${this.token}`,
      }),
    })
      .subscribe(
        (response) => {
          // Handle successful search
          console.log('Search results:', response);
          this.searchResults.emit(response);
        },
        (error) => {
          console.error('Error searching properties:', error);
          // Handle error
        }
      );
  }
}
