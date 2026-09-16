import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product, ProductVariant } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  product?: Product;
  selectedVariant?: ProductVariant;
  selectedImage = '';
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'معرّف المنتج غير موجود';
      return;
    }

    this.loading = true;

    this.productService.getProductById(id).subscribe({
      next: product => {
        this.product = product;
        this.selectedVariant = product.variants[0];
        this.selectedImage = product.images?.[0] || '';
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'تعذر تحميل المنتج';
      }
    });
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  getImageUrl(image: string): string {
    if (!image) return '';
    return image.startsWith('http') ? image : `/${image}`;
  }

  getAttributeText(variant: ProductVariant): string {
    return Object.entries(variant.attributes || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join(' • ');
  }

  getSupplierName(supplier: any): string {
    if (!supplier) return 'غير محدد';
    if (typeof supplier === 'string') return supplier;
    return supplier.name || supplier.companyName || 'غير محدد';
  }
}
