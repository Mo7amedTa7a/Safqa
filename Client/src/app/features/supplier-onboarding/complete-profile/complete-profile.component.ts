import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupplierProfileService } from '../../../core/services/supplier-profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { SupplierProfile, VerificationStatus } from '../../../core/models/supplier-profile.model';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css'
})
export class CompleteProfileComponent implements OnInit {
  supplierForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  rejectionNotice: string | null = null;
  existingProfile: SupplierProfile | null = null;
  verificationStatus: VerificationStatus | null = null;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.supplierForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      companyDescription: ['', [Validators.required, Validators.minLength(10)]],
      commercialRegistrationNumber: ['', [Validators.required]],
      taxIdentificationNumber: ['', [Validators.required]],
      businessAddress: ['', [Validators.required]],
      businessPhone: ['', [Validators.required]],
      website: [''],
      yearsInBusiness: [1, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.role !== UserRole.SUPPLIER && user.role !== UserRole.ADMIN) {
      this.router.navigate(['/unauthorized']);
      return;
    }

    this.checkExistingProfile();
  }

  checkExistingProfile(): void {
    this.supplierService.getMyProfile().subscribe({
      next: (res) => {
        const profile = res.data;
        if (!profile) return;

        this.existingProfile = profile;
        this.verificationStatus = profile.verificationStatus || 'PENDING';

        this.supplierForm.patchValue({
          companyName: profile.companyName,
          companyDescription: profile.companyDescription,
          commercialRegistrationNumber: profile.commercialRegistrationNumber,
          taxIdentificationNumber: profile.taxIdentificationNumber,
          businessAddress: profile.businessAddress,
          businessPhone: profile.businessPhone,
          website: profile.website || '',
          yearsInBusiness: profile.yearsInBusiness || 1
        });

        if (profile.verificationStatus === 'REJECTED') {
          this.rejectionNotice = profile.rejectionReason || 'تم رفض الطلب السابق. يرجى تعديل البيانات وإعادة الإرسال.';
        }
      },
      error: () => {
        // No existing profile, user creates fresh profile
      }
    });
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.supplierService.createProfile(this.supplierForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.existingProfile = res.data || null;
        this.verificationStatus = res.data?.verificationStatus || 'PENDING';
        this.rejectionNotice = null;
        this.successMessage = 'تم حفظ وتحديث بيانات منشأتك بنجاح! الملف قيد المراجعة والتدقيق.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'فشل إرسال بيانات المورد. تأكد من صحة البيانات وعدم تكرار السجل التجاري.';
      }
    });
  }
}
