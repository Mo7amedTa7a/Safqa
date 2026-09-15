import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {

  orders: Order[] = [];

  isLoading = true;

  errorMessage = '';

  constructor(
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.isLoading = true;

    this.orderService.getOrders().subscribe({

      next: (response) => {

        this.orders = response.data ?? [];

        this.isLoading = false;

      },

      error: () => {

        this.errorMessage = 'حدث خطأ أثناء تحميل الطلبات';

        this.isLoading = false;

      }

    });

  }

  getSupplierName(order: Order): string {

  if (typeof order.supplier === 'string') {
    return 'المورد';
  }

  return order.supplier?.name ?? 'مورد غير معروف';

}

}
