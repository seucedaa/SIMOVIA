import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboradorEditarComponent } from './colaboradoreditar.component';

describe('ColaboradorEditarComponent', () => {
  let component: ColaboradorEditarComponent;
  let fixture: ComponentFixture<ColaboradorEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColaboradorEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColaboradorEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
