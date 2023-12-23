import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GunSoundComponent } from './gun-sound.component';

describe('GunSoundComponent', () => {
  let component: GunSoundComponent;
  let fixture: ComponentFixture<GunSoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GunSoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GunSoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
