import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePersonalizadoComponent } from './reporte-personalizado.component';

describe('ReportePersonalizadoComponent', () => {
  let component: ReportePersonalizadoComponent;
  let fixture: ComponentFixture<ReportePersonalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePersonalizadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportePersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
