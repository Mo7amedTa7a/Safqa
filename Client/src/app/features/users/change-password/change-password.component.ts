import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const p = control.get('newPassword')?.value;
    const cp = control.get('confirmNewPassword')?.value;
    return p === cp ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.successMessage = 'تم تغيير كلمة المرور بنجاح!';
      setTimeout(() => this.router.navigate(['/profile']), 1500);
    }
  }
}
