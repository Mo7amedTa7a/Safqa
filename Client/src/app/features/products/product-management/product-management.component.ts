import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductVariant } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class AdminProductManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProductService);

  products: Product[] = [];
  editingId: string | null = null;
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    images: [''],
    variantsJson: ['[{"sku":"SKU-001","attributes":{"color":"Black"},"price":0,"stock":0}]']
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.service.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'تعذر تحميل المنتجات';
      }
    });
  }

  edit(product: Product): void {
    this.editingId = product._id;
    this.successMessage = '';
    this.errorMessage = '';

    this.form.patchValue({
      name: product.name,
      description: product.description,
      category: product.category,
      images: product.images.join(', '),
      variantsJson: JSON.stringify(product.variants, null, 2)
    });
  }

  reset(): void {
    this.editingId = null;
    this.form.reset({
      name: '',
      description: '',
      category: '',
      images: '',
      variantsJson: '[{"sku":"SKU-001","attributes":{"color":"Black"},"price":0,"stock":0}]'
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let variants: ProductVariant[];

    try {
      variants = JSON.parse(this.form.controls.variantsJson.value);
    } catch {
      this.errorMessage = 'بيانات الـvariants يجب أن تكون JSON صحيحة.';
      return;
    }

    const data = {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
      category: this.form.controls.category.value,
      images: this.form.controls.images.value
        .split(',')
        .map(image => image.trim())
        .filter(Boolean),
      variants
    };

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request$ = this.editingId
      ? this.service.updateProduct(this.editingId, data)
      : this.service.createProduct(data);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = this.editingId
          ? 'تم تحديث المنتج بنجاح.'
          : 'تم إنشاء المنتج بنجاح.';
        this.reset();
        this.loadProducts();
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error?.error?.message || 'تعذر حفظ المنتج';
      }
    });
  }

  remove(product: Product): void {
    const confirmed = window.confirm(`هل تريد حذف المنتج "${product.name}"؟`);

    if (!confirmed) return;

    this.service.deleteProduct(product._id).subscribe({
      next: () => {
        this.successMessage = 'تم حذف المنتج.';
        this.loadProducts();
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'تعذر حذف المنتج';
      }
    });
  }
}
