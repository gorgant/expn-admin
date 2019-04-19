import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/core/models/products/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent implements OnInit {

  productList$: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeGeographicData();
  }

  onCreateProduct() {
    this.router.navigate([AppRoutes.PRODUCT_NEW]);
  }

  private initializeGeographicData() {
    this.productList$ = this.productService.fetchAllProducts();
  }

}
