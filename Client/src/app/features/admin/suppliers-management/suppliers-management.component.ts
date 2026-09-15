import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierProfileService } from '../../../core/services/supplier-profile.service';
import { SupplierProfile } from '../../../core/models/supplier-profile.model';

@Component({
  selector: 'app-suppliers-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers-management.component.html',
  styleUrl: './suppliers-management.component.css'
})
export class SuppliersManagementComponent implements OnInit {
  profiles: SupplierProfile[] = [];
  filteredProfiles: SupplierProfile[] = [];
  isLoading = true;
  statusFilter = 'ALL';
  selectedProfileForReject: SupplierProfile | null = null;
  rejectionReasonInput = '';
  searchTerm = '';
  isProcessing = false;

  constructor(private supplierService: SupplierProfileService) {}

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.isLoading = true;
    this.supplierService.getAllProfiles().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.profiles = res.data || [];
        this.applyFilter();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    let result = this.profiles;
    
    // Status Filter
    if (this.statusFilter !== 'ALL') {
      result = result.filter(p => p.verificationStatus === this.statusFilter);
    }
    
    // Search Term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p => 
        p.companyName?.toLowerCase().includes(term) ||
        p.businessAddress?.toLowerCase().includes(term) ||
        p.businessPhone?.toLowerCase().includes(term) ||
        p.taxIdentificationNumber?.toLowerCase().includes(term) ||
        p.commercialRegistrationNumber?.toLowerCase().includes(term)
      );
    }
    
    this.filteredProfiles = result;
  }

  approveSupplier(profile: SupplierProfile): void {
    if (!profile._id) return;
    if (!confirm(`هل أنت متأكد من اعتماد المورد "${profile.companyName}" وتفعيل حسابه؟`)) return;

    this.isProcessing = true;
    this.supplierService.approveSupplier(profile._id).subscribe({
      next: () => {
        this.isProcessing = false;
        profile.verificationStatus = 'APPROVED';
        profile.supplierStatus = 'ACTIVE';
      },
      error: (err) => {
        this.isProcessing = false;
        alert(err.error?.message || 'فشلت عملية الاعتماد.');
      }
    });
  }

  openRejectModal(profile: SupplierProfile): void {
    this.selectedProfileForReject = profile;
    this.rejectionReasonInput = '';
  }

  closeRejectModal(): void {
    this.selectedProfileForReject = null;
    this.rejectionReasonInput = '';
  }

  confirmReject(): void {
    const profile = this.selectedProfileForReject;
    if (!profile || !profile._id || !this.rejectionReasonInput.trim()) return;

    this.isProcessing = true;
    const profileId = profile._id;

    this.supplierService.rejectSupplier(profileId, this.rejectionReasonInput).subscribe({
      next: () => {
        this.isProcessing = false;
        profile.verificationStatus = 'REJECTED';
        profile.supplierStatus = null;
        profile.rejectionReason = this.rejectionReasonInput;
        this.closeRejectModal();
      },
      error: (err) => {
        this.isProcessing = false;
        alert(err.error?.message || 'فشلت عملية الرفض.');
      }
    });
  }
}
