import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/core/models/products/product.model';
import { AdminImagePaths } from 'src/app/core/models/routes-and-paths/image-paths.model';
import { Router } from '@angular/router';
import { AdminAppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DeleteConfData } from 'src/app/core/models/forms-and-components/delete-conf-data.model';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreActions } from 'src/app/root-store';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;
  imagePaths = AdminImagePaths;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
  }

  onEditProduct() {
    this.router.navigate([AdminAppRoutes.PRODUCT_EDIT, this.product.id]);
  }

  onToggleProductActive() {
    console.log('Activate product toggled');
    this.store$.dispatch(new ProductStoreActions.ToggleActiveRequested({product: this.product}));
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
        this.store$.dispatch(new ProductStoreActions.DeleteProductRequested({productId: this.product.id}));
      }
    });
  }

}
