import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreActions, ProductStoreSelectors } from 'src/app/root-store';
import { Product } from 'shared-models/products/product.model';
import { AdminImagePaths } from 'shared-models/routes-and-paths/image-paths.model';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { DeleteConfData } from 'shared-models/forms-and-components/delete-conf-data.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;
  imagePaths = AdminImagePaths;
  isTogglingActive$: Observable<boolean>;

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
    this.isTogglingActive$ = this.store$.select(ProductStoreSelectors.selectIsTogglingActive);
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
