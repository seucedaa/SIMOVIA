import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajeEditarComponent } from './viajeeditar.component';

describe('ViajeEditarComponent', () => {
  let component: ViajeEditarComponent;
  let fixture: ComponentFixture<ViajeEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViajeEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViajeEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
