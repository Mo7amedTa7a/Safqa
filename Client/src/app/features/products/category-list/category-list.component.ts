import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  categories: Category[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loading = true;

    this.productService.getCategories().subscribe({
      next: categories => {
        this.categories = categories.filter(category => category.isActive !== false);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'تعذر تحميل التصنيفات';
      }
    });
  }
}
