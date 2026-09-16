import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../product-card.component';
import { Category, Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  products: Product[] = [];
  categories: Category[] = [];

  search = '';
  selectedCategory = '';
  page = 1;
  pageSize = 6;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: categories => this.categories = categories.filter(category => category.isActive !== false),
      error: () => this.errorMessage = 'تعذر تحميل التصنيفات'
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts({
      name: this.search.trim() || undefined,
      category: this.selectedCategory || undefined,
      status: 'ACTIVE'
    }).subscribe({
      next: products => {
        this.products = products;
        this.page = 1;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'تعذر تحميل المنتجات';
      }
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.search = '';
    this.selectedCategory = '';
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.products.length / this.pageSize));
  }

  get pagedProducts() {
    const start = (this.page - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }
}
