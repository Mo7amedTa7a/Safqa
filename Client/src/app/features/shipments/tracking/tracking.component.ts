import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShipmentService } from '../services/shipment.service';
import { Shipment } from '../models/shipment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  shipment: Shipment | null = null;
  searchNumber = '';
  isLoading = false;
  errorMessage = '';

  timelineSteps = [
    { key: 'PENDING', label: 'تم تقديم الطلب', icon: 'bi-file-earmark-check' },
    { key: 'READY_FOR_PICKUP', label: 'جاهز للاستلام', icon: 'bi-box-seam' },
    { key: 'PICKED_UP', label: 'تم الاستلام من المورد', icon: 'bi-truck-flatbed' },
    { key: 'IN_TRANSIT', label: 'في الطريق', icon: 'bi-truck' },
    { key: 'OUT_FOR_DELIVERY', label: 'جاري التسليم', icon: 'bi-geo-alt' },
    { key: 'DELIVERED', label: 'تم التسليم', icon: 'bi-check-circle-fill' }
  ];

  constructor(
    private route: ActivatedRoute,
    private shipmentService: ShipmentService
  ) {}

  ngOnInit(): void {
    const trackingNo = this.route.snapshot.paramMap.get('trackingNumber') || this.route.snapshot.paramMap.get('id');
    if (trackingNo) {
      this.searchNumber = trackingNo;
      this.trackShipment(trackingNo);
    }
  }

  trackShipment(numberToSearch?: string): void {
    const num = numberToSearch || this.searchNumber;
    if (!num) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.shipmentService.getShipmentById(num).subscribe({
      next: (res) => {
        this.shipment = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'لم يتم العثور على شحنة بهذا الرقم';
        this.isLoading = false;
      }
    });
  }

  isStepActive(stepKey: string): boolean {
    if (!this.shipment) return false;
    const statusOrder = ['PENDING', 'READY_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(this.shipment.status);
    const stepIndex = statusOrder.indexOf(stepKey);
    return stepIndex <= currentIndex && currentIndex !== -1;
  }
}
