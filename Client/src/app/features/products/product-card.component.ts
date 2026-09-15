import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from './models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <article class="product-card">
      <div class="image-box">
        <img
          [src]="imageUrl"
          [alt]="product.name"
          (error)="imageFailed = true"
          *ngIf="!imageFailed"
        />
        <div class="image-fallback" *ngIf="imageFailed">
          <span>لا توجد صورة</span>
        </div>
        <span class="status-badge" [class.inactive]="product.status !== 'ACTIVE'">
          {{ product.status === 'ACTIVE' ? 'متاح' : 'غير متاح' }}
        </span>
      </div>

      <div class="content">
        <span class="category">{{ product.category }}</span>
        <h3>{{ product.name }}</h3>

        <p class="description">
          {{ product.description }}
        </p>

        <div class="price-row">
          <strong>{{ lowestPrice | currency:'EGP':'symbol':'1.0-0' }}</strong>
          <span>{{ product.variants.length }} خيارات</span>
        </div>

        <a class="details-button" [routerLink]="['/products', product._id]">
          عرض التفاصيل
        </a>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .product-card {
      height: 100%;
      overflow: hidden;
      background: #fff;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      transition: .2s ease;
    }
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(15, 81, 50, .08);
      border-color: #B7D7C8;
    }
    .image-box {
      position: relative;
      height: 190px;
      display: grid;
      place-items: center;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
    }
    img { width: 100%; height: 100%; object-fit: contain; padding: 16px; }
    .image-fallback { color: #64748B; }
    .status-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 9px;
      border-radius: 999px;
      background: #DCFCE7;
      color: #166534;
      font-size: 12px;
      font-weight: 700;
    }
    .status-badge.inactive { background: #FEE2E2; color: #991B1B; }
    .content { padding: 16px; }
    .category { color: #059669; font-size: 12px; font-weight: 700; }
    h3 { margin: 7px 0; color: #0F172A; font-size: 18px; }
    .description {
      height: 42px;
      margin: 0;
      overflow: hidden;
      color: #64748B;
      font-size: 13px;
      line-height: 1.6;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 0;
    }
    .price-row strong { color: #0F5132; font-size: 18px; }
    .price-row span { color: #64748B; font-size: 12px; }
    .details-button {
      display: block;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      color: #fff;
      background: #0F5132;
      border-radius: 9px;
      font-weight: 700;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  imageFailed = false;

  get imageUrl(): string {
    const image = this.product.images?.[0];

    if (!image) {
      return '';
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    return image.startsWith('/') ? image : `/${image}`;
  }

  get lowestPrice(): number {
    if (!this.product.variants?.length) {
      return 0;
    }

    return Math.min(...this.product.variants.map(variant => variant.price));
  }
}
