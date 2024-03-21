import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageFiltersComponent } from './landing-page-filters.component';

describe('LandingPageFiltersComponent', () => {
  let component: LandingPageFiltersComponent;
  let fixture: ComponentFixture<LandingPageFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingPageFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
