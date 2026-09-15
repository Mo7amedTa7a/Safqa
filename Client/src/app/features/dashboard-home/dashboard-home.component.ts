import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SupplierProfileService } from '../../core/services/supplier-profile.service';
import { User, UserRole } from '../../core/models/user.model';
import { SupplierProfile } from '../../core/models/supplier-profile.model';

interface ActivePool {
  id: string;
  title: string;
  category: string;
  discount: string;
  progressPercent: number;
  currentUnits: string;
  targetUnits: string;
  timeLeft: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User | null = null;
  supplierProfile: SupplierProfile | null = null;
  isPendingSupplier = false;
  isRejectedSupplier = false;
  rejectionReason: string | null = null;
  isLoadingProfile = false;
  UserRole = UserRole;

  // Buyer KPI Stats
  buyerKpiStats = [
    { value: '1,480', label: 'صفقة نشطة', icon: 'bi-collection' },
    { value: '+940', label: 'مورد معتمد', icon: 'bi-patch-check' },
    { value: '35%', label: 'متوسط التوفير', icon: 'bi-percent' },
    { value: '100%', label: 'ضمان الصفقات', icon: 'bi-shield-check' }
  ];

  // Supplier KPI Stats (For approved suppliers)
  supplierKpiStats = [
    { value: '18', label: 'طلب توريد متاح', icon: 'bi-inbox-fill' },
    { value: '5', label: 'عروض أسعار نشطة', icon: 'bi-send-check' },
    { value: '42', label: 'صفقة توريد ناجحة', icon: 'bi-check2-circle' },
    { value: '4.9 ★', label: 'تقييم المنشأة', icon: 'bi-patch-check-fill' }
  ];

  // Buyer active pools
  activePools: ActivePool[] = [
    {
      id: '1',
      title: 'خامات ومواد تعبئة وتغليف كرتون مضلع',
      category: 'التعبئة والتغليف',
      discount: 'خصم 30%',
      progressPercent: 85,
      currentUnits: '425 كرتونة',
      targetUnits: '500 كرتونة',
      timeLeft: 'باقي 24 ساعة'
    },
    {
      id: '2',
      title: 'أجهزة ومستلزمات مكتبية وتقنية للشركات',
      category: 'الأجهزة والمعدات',
      discount: 'خصم 25%',
      progressPercent: 65,
      currentUnits: '65 شركة',
      targetUnits: '100 شركة',
      timeLeft: 'باقي 3 أيام'
    },
    {
      id: '3',
      title: 'ورق طباعة A4 مواصفات قياسية مستورد',
      category: 'المستلزمات المكتبية',
      discount: 'خصم 35%',
      progressPercent: 92,
      currentUnits: '920 باكتة',
      targetUnits: '1,000 باكتة',
      timeLeft: 'يغلق قريباً'
    }
  ];

  // Supplier open RFQs (Opportunities for suppliers to submit bids)
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
        // Default to pending until profile check proves approved
        this.isPendingSupplier = true;
        this.loadSupplierStatus();
      } else {
        this.isPendingSupplier = false;
        this.isRejectedSupplier = false;
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
          // Supplier has no profile created yet -> definitely pending
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
      // PENDING or not yet approved
      this.isPendingSupplier = true;
      this.isRejectedSupplier = false;
    }
  }

  getRoleLabel(role?: string): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'مسؤول النظام';
      case UserRole.SUPPLIER:
        return this.isPendingSupplier ? 'مورد (قيد المراجعة)' : 'مورد معتمد';
      case UserRole.BUYER:
        return 'مشتري معتمد';
      default:
        return 'عضو';
    }
  }
}

