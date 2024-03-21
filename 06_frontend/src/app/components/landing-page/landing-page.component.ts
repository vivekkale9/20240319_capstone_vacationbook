import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  listings: any[] = [
    { title: 'Listing 1', price: 999, imageUrl: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg' },
    { title: 'Listing 2', price: 999, imageUrl: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg' },
    { title: 'Listing 3', price: 999, imageUrl: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg' },
    { title: 'Listing 4', price: 999, imageUrl: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg' }
  ];
}
