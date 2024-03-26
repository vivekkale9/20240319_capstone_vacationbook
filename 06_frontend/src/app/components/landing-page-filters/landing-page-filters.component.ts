import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-landing-page-filters',
  templateUrl: './landing-page-filters.component.html',
  styleUrl: './landing-page-filters.component.css'
})
export class LandingPageFiltersComponent {
  @Output() filterSelected: EventEmitter<string> = new EventEmitter<string>();

  filterByCategory(category: string) {
    this.filterSelected.emit(category);
  }
}
