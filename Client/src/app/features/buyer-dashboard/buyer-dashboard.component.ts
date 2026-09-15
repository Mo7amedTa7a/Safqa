import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models/user.model';

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
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buyer-dashboard.component.html',
  styleUrl: './buyer-dashboard.component.css'
})
export class BuyerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  UserRole = UserRole;

  buyerKpiStats = [
    { value: '1,480', label: 'صفقة نشطة', icon: 'bi-collection' },
    { value: '+940', label: 'مورد معتمد', icon: 'bi-patch-check' },
    { value: '35%', label: 'متوسط التوفير', icon: 'bi-percent' },
    { value: '100%', label: 'ضمان الصفقات', icon: 'bi-shield-check' }
  ];

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
    });
  }

  getRoleLabel(role?: string): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'مسؤول النظام';
      case UserRole.BUYER:
        return 'مشتري معتمد';
      default:
        return 'عضو';
    }
  }
}
