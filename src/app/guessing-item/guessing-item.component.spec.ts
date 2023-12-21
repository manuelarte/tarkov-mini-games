import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessingItemComponent } from './guessing-item.component';

describe('GuessingItemComponent', () => {
  let component: GuessingItemComponent;
  let fixture: ComponentFixture<GuessingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessingItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuessingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
