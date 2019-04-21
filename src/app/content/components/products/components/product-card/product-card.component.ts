import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/core/models/products/product.model';
import { ImagePaths } from 'src/app/core/models/routes-and-paths/image-paths.model';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DeleteConfData } from 'src/app/core/models/forms/delete-conf-data.model';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { take } from 'rxjs/operators';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  imagePaths = ImagePaths;
  @Input() product: Product;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private productService: ProductService
  ) { }

  ngOnInit() {
  }

  onEditProduct() {
    this.router.navigate([AppRoutes.PRODUCT_EDIT, this.product.id]);
  }

  onActivateProduct() {
    this.productService.activateProduct(this.product);
  }

  onDeactivateProduct() {
    this.productService.deactivateProduct(this.product);
  }

  onDelete() {
    const dialogConfig = new MatDialogConfig();

    const deleteConfData: DeleteConfData = {
      title: 'Delete Product',
      body: 'Are you sure you want to permanently delete this product?'
    };

    dialogConfig.data = deleteConfData;

    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      if (userConfirmed) {
        this.deletePost();
      }
    });
  }

  private deletePost() {
    this.productService.deleteProduct(this.product.id);
  }

}
