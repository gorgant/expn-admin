import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreActions, ProductStoreSelectors } from 'src/app/root-store';
import { Product, ProductKeys } from 'shared-models/products/product.model';
import { AdminImagePaths } from 'shared-models/routes-and-paths/image-paths.model';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { Observable } from 'rxjs';
import { ActionConfData } from 'shared-models/forms-and-components/action-conf-data.model';
import { ActionConfirmDialogueComponent } from 'src/app/shared/components/action-confirm-dialogue/action-confirm-dialogue.component';

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

    const deleteConfData: ActionConfData = {
      title: 'Delete Product',
      body: 'Are you sure you want to permanently delete this product?'
    };

    dialogConfig.data = deleteConfData;

    const dialogRef = this.dialog.open(ActionConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      if (userConfirmed) {
        this.store$.dispatch(new ProductStoreActions.DeleteProductRequested({productId: this.product.id}));
      }
    });
  }

  onCloneProductToAltAdmin() {

    // Clone everything but the image data (which will need to be adjusted manually)
    const clonedProductData: Partial<Product> = {
      id: this.product.id,
      [ProductKeys.NAME]: this.product[ProductKeys.NAME],
      [ProductKeys.PRICE]: this.product[ProductKeys.PRICE],
      [ProductKeys.LIST_ORDER]: this.product[ProductKeys.LIST_ORDER],
      [ProductKeys.TAGLINE]: this.product[ProductKeys.TAGLINE],
      productCardData: this.product.productCardData,
      heroData: this.product.heroData,
      buyNowData: this.product.buyNowData,
      checkoutData: this.product.checkoutData,
      [ProductKeys.PRODUCT_CATEGORY]: this.product[ProductKeys.PRODUCT_CATEGORY],
      [ProductKeys.SKILLSHARE_URL]: this.product[ProductKeys.SKILLSHARE_URL],
      [ProductKeys.SKILLSHARE_ACTIVE]: this.product[ProductKeys.SKILLSHARE_ACTIVE],
      [ProductKeys.WAITLIST_ACTIVE]: this.product[ProductKeys.WAITLIST_ACTIVE],
      active: false,
      readyToActivate: false,
    };

    const wrappedProduct = clonedProductData as Product;


    // TODO: test this function

    const dialogConfig = new MatDialogConfig();

    const cloneConfData: ActionConfData = {
      title: 'Clone Product',
      body: 'Are you sure you want to clone this product on the alt admin and possibly overwrite that data?'
    };

    dialogConfig.data = cloneConfData;

    const dialogRef = this.dialog.open(ActionConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      if (userConfirmed) {
        this.store$.dispatch(new ProductStoreActions.CloneProductRequested({product: wrappedProduct}));
      }
    });

  }

}
