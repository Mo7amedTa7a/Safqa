import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuyingPoolsComponent } from './admin-buying-pools.component';

describe('AdminBuyingPoolsComponent', () => {
  let component: AdminBuyingPoolsComponent;
  let fixture: ComponentFixture<AdminBuyingPoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBuyingPoolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBuyingPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
