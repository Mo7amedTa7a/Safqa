import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShipmentService } from '../services/shipment.service';
import { Shipment } from '../models/shipment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipment-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shipment-details.component.html',
  styleUrls: ['./shipment-details.component.css']
})
export class ShipmentDetailsComponent implements OnInit {
  shipment: Shipment | null = null;
  isLoading = false;
  errorMessage = '';
  isUpdating = false;

  statusOptions = [
    { value: 'PENDING', label: 'قيد الانتظار' },
    { value: 'READY_FOR_PICKUP', label: 'جاهز للاستلام' },
    { value: 'PICKED_UP', label: 'تم الاستلام من المورد' },
    { value: 'IN_TRANSIT', label: 'في الطريق' },
    { value: 'OUT_FOR_DELIVERY', label: 'في الطريق للتسليم' },
    { value: 'DELIVERED', label: 'تم التسليم بنجاح' },
    { value: 'DELIVERY_FAILED', label: 'فشل التسليم' },
    { value: 'RETURN_TO_SUPPLIER', label: 'مرتجع للمورد' },
    { value: 'RETURNED', label: 'تم الإرجاع' }
  ];

  constructor(
    private route: ActivatedRoute,
    private shipmentService: ShipmentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadShipmentDetails(id);
    }
  }

  loadShipmentDetails(id: string): void {
    this.isLoading = true;
    this.shipmentService.getShipmentById(id).subscribe({
      next: (res) => {
        this.shipment = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تحميل تفاصيل الشحنة';
        this.isLoading = false;
      }
    });
  }

  updateStatus(newStatus: string): void {
    if (!this.shipment || !newStatus) return;

    this.isUpdating = true;
    this.shipmentService.updateShipmentStatus(this.shipment._id, newStatus).subscribe({
      next: (res) => {
        this.shipment = res.data;
        this.isUpdating = false;
      },
      error: (err) => {
        alert(err.error?.message || 'فشل تحديث الحالة');
        this.isUpdating = false;
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
}
