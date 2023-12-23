import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GunSoundItemComponent } from './gun-sound-item.component';

describe('GunSoundItemComponent', () => {
  let component: GunSoundItemComponent;
  let fixture: ComponentFixture<GunSoundItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GunSoundItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GunSoundItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
