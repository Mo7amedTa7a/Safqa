import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  form: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'تعذر إرسال رابط الاستعادة. تأكد من صحة البريد الإلكتروني.';
      }
    });
  }
}
