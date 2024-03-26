import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMapComponent } from './property-map.component';

describe('PropertyMapComponent', () => {
  let component: PropertyMapComponent;
  let fixture: ComponentFixture<PropertyMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
