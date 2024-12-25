import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboradorCrearComponent } from './colaboradorcrear.component';

describe('ColaboradorCrearComponent', () => {
  let component: ColaboradorCrearComponent;
  let fixture: ComponentFixture<ColaboradorCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColaboradorCrearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColaboradorCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
