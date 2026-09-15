import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuyingRequestsComponent } from './admin-buying-requests.component';

describe('AdminBuyingRequestsComponent', () => {
  let component: AdminBuyingRequestsComponent;
  let fixture: ComponentFixture<AdminBuyingRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBuyingRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBuyingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
