import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingCompletedComponent } from './sorting-completed.component';

describe('SortingCompletedComponent', () => {
  let component: SortingCompletedComponent;
  let fixture: ComponentFixture<SortingCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortingCompletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SortingCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
