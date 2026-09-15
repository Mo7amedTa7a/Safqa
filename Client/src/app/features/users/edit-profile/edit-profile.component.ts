import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  isSaving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  profileImage: string | null = null;
  selectedFile: File | null = null;
  isImageRemoved = false;
  imageError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required]],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.getMe().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.profileForm.patchValue({
            name: res.data.name || '',
            phone: res.data.phone || '',
            address: res.data.address || ''
          });
          this.profileImage = res.data.profileImage || null;
        }
      },
      error: () => {
        this.isLoading = false;
        const current = this.authService.currentUserValue;
        if (current) {
          this.profileForm.patchValue({
            name: current.name || '',
            phone: current.phone || '',
            address: current.address || ''
          });
          this.profileImage = current.profileImage || null;
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.imageError = 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت';
        return;
      }

      // Validate type
      if (!file.type.startsWith('image/')) {
        this.imageError = 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)';
        return;
      }

      this.imageError = null;
      this.selectedFile = file;
      this.isImageRemoved = false;

      // Show instant preview in the UI
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfileImage(): void {
    this.profileImage = null;
    this.selectedFile = null;
    this.isImageRemoved = true;
    this.imageError = null;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.successMessage = null;
    this.errorMessage = null;

    // Send multipart FormData to upload the physical file
    const formData = new FormData();
    formData.append('name', this.profileForm.get('name')?.value || '');
    formData.append('phone', this.profileForm.get('phone')?.value || '');
    formData.append('address', this.profileForm.get('address')?.value || '');

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    } else if (this.isImageRemoved) {
      formData.append('profileImage', '');
      formData.append('removeProfileImage', 'true');
    }

    this.userService.updateMe(formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = 'تم تحديث بيانات الملف الشخصي بنجاح!';
        if (res.data) {
          this.authService.updateUser(res.data);
        }
        setTimeout(() => this.router.navigate(['/profile']), 1200);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء حفظ التعديلات.';
      }
    });
  }
}
