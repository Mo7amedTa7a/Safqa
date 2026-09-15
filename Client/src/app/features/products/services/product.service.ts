import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Category,
  CategoryListResponse,
  Product,
  ProductListResponse
} from '../models/product.model';

export interface ProductFilters {
  name?: string;
  category?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();

    if (filters?.name) {
      params = params.set('name', filters.name);
    }

    if (filters?.category) {
      params = params.set('category', filters.category);
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    return this.http
      .get<ProductListResponse>(`${this.apiUrl}/products`, { params })
      .pipe(map(response => response.data));
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<{ status: string; message: string; data: Product }>(
        `${this.apiUrl}/products/${id}`
      )
      .pipe(map(response => response.data));
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http
      .post<{ status: string; message: string; data: Product }>(
        `${this.apiUrl}/products`,
        data
      )
      .pipe(map(response => response.data));
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    return this.http
      .patch<{ status: string; message: string; data: Product }>(
        `${this.apiUrl}/products/${id}`,
        data
      )
      .pipe(map(response => response.data));
  }

  deleteProduct(id: string): Observable<Product> {
    return this.http
      .delete<{ status: string; message: string; data: Product }>(
        `${this.apiUrl}/products/${id}`
      )
      .pipe(map(response => response.data));
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<CategoryListResponse>(`${this.apiUrl}/categories`)
      .pipe(map(response => response.data.categories));
  }
}
