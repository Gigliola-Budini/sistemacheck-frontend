import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMinsalComponent } from './reporte-minsal.component';

describe('ReporteMinsalComponent', () => {
  let component: ReporteMinsalComponent;
  let fixture: ComponentFixture<ReporteMinsalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteMinsalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteMinsalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
