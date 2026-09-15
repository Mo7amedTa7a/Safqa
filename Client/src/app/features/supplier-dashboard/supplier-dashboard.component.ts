import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SupplierProfileService } from '../../core/services/supplier-profile.service';
import { User, UserRole } from '../../core/models/user.model';
import { SupplierProfile } from '../../core/models/supplier-profile.model';

@Component({
  selector: 'app-supplier-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-dashboard.component.html',
  styleUrl: './supplier-dashboard.component.css'
})
export class SupplierDashboardComponent implements OnInit {
  currentUser: User | null = null;
  supplierProfile: SupplierProfile | null = null;
  isPendingSupplier = false;
  isRejectedSupplier = false;
  rejectionReason: string | null = null;
  isLoadingProfile = false;
  UserRole = UserRole;

  supplierKpiStats = [
    { value: '18', label: 'طلب توريد متاح', icon: 'bi-inbox-fill' },
    { value: '5', label: 'عروض أسعار نشطة', icon: 'bi-send-check' },
    { value: '42', label: 'صفقة توريد ناجحة', icon: 'bi-check2-circle' },
    { value: '4.9 ★', label: 'تقييم المنشأة', icon: 'bi-patch-check-fill' }
  ];

  openRfqs = [
    {
      id: '101',
      title: 'مطلوب توريد 500 كرتونة تغليف مقاس 40×40 سم 5 طبقات',
      category: 'تعبئة وتغليف',
      buyer: 'مؤسسة التجارة والخدمات اللوجستية',
      deadline: 'باقي يومين',
      bidsCount: 3,
      status: 'مفتوح لتقديم العروض'
    },
    {
      id: '102',
      title: 'توريد أجهزة حواسيب مكتبية وشاشات عرض للمقر الرئيسي',
      category: 'أجهزة وتقنية',
      buyer: 'شركة النماء للاستثمار',
      deadline: 'باقي 5 أيام',
      bidsCount: 6,
      status: 'مفتوح لتقديم العروض'
    },
    {
      id: '103',
      title: 'توريد ورق تصوير وطباعة أبيض مستورد 80 جرام كميات كبرى',
      category: 'مستلزمات مكتبية',
      buyer: 'سلسلة مراكز الأعمال المتطورة',
      deadline: 'ينتهي اليوم',
      bidsCount: 8,
      status: 'يغلق قريباً'
    }
  ];

  constructor(
    private authService: AuthService,
    private supplierService: SupplierProfileService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u && u.role === UserRole.SUPPLIER) {
        this.isPendingSupplier = true;
        this.loadSupplierStatus();
      }
    });

    this.supplierService.profile$.subscribe(profile => {
      if (this.currentUser?.role === UserRole.SUPPLIER && profile) {
        this.supplierProfile = profile;
        this.evaluateStatus(profile);
      }
    });
  }

  loadSupplierStatus(): void {
    this.isLoadingProfile = true;
    this.supplierService.getMyProfile().subscribe({
      next: (res) => {
        this.isLoadingProfile = false;
        this.supplierProfile = res.data || null;
        if (this.supplierProfile) {
          this.evaluateStatus(this.supplierProfile);
        } else {
          this.isPendingSupplier = true;
        }
      },
      error: () => {
        this.isLoadingProfile = false;
        this.isPendingSupplier = true;
      }
    });
  }

  private evaluateStatus(profile: SupplierProfile): void {
    if (profile.verificationStatus === 'APPROVED') {
      this.isPendingSupplier = false;
      this.isRejectedSupplier = false;
    } else if (profile.verificationStatus === 'REJECTED') {
      this.isPendingSupplier = false;
      this.isRejectedSupplier = true;
      this.rejectionReason = profile.rejectionReason || null;
    } else {
      this.isPendingSupplier = true;
      this.isRejectedSupplier = false;
    }
  }

  getRoleLabel(): string {
    return this.isPendingSupplier ? 'مورد (قيد المراجعة)' : 'مورد معتمد';
  }
}
