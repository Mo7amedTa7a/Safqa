import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettlementsComponent } from './admin-settlements.component';

describe('AdminSettlementsComponent', () => {
  let component: AdminSettlementsComponent;
  let fixture: ComponentFixture<AdminSettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSettlementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
