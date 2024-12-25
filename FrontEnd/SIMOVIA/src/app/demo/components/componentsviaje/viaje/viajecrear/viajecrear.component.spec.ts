import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajeCrearComponent } from './viajecrear.component';

describe('ViajeCrearComponent', () => {
  let component: ViajeCrearComponent;
  let fixture: ComponentFixture<ViajeCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViajeCrearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViajeCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
