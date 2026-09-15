import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../services/shipment.service';
import { Shipment } from '../models/shipment.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.css']
})
export class ShipmentListComponent implements OnInit {
  shipments: Shipment[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private shipmentService: ShipmentService) {}

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.isLoading = true;
    this.shipmentService.getShipments().subscribe({
      next: (res) => {
        this.shipments = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل الشحنات';
        this.isLoading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge text-bg-warning';
      case 'READY_FOR_PICKUP': return 'badge text-bg-info';
      case 'PICKED_UP': return 'badge text-bg-primary';
      case 'IN_TRANSIT': return 'badge text-bg-primary';
      case 'OUT_FOR_DELIVERY': return 'badge text-bg-primary';
      case 'DELIVERED': return 'badge text-bg-success';
      case 'DELIVERY_FAILED': return 'badge text-bg-danger';
      case 'RETURN_TO_SUPPLIER': return 'badge text-bg-warning';
      case 'RETURNED': return 'badge text-bg-danger';
      default: return 'badge text-bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'قيد الانتظار';
      case 'READY_FOR_PICKUP': return 'جاهز للاستلام';
      case 'PICKED_UP': return 'تم الاستلام من المورد';
      case 'IN_TRANSIT': return 'في الطريق';
      case 'OUT_FOR_DELIVERY': return 'في الطريق للتسليم';
      case 'DELIVERED': return 'تم التسليم';
      case 'DELIVERY_FAILED': return 'فشل التسليم';
      case 'RETURN_TO_SUPPLIER': return 'مرتجع للمورد';
      case 'RETURNED': return 'تم الإرجاع';
      default: return status;
    }
  }
}
