import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PRODUCT_FORM_VALIDATION_MESSAGES } from 'src/app/core/models/forms-and-components/validation-messages.model';
import { Subscription, Observable, of, from } from 'rxjs';
import { Product } from 'src/app/core/models/products/product.model';
import { take, withLatestFrom, map } from 'rxjs/operators';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { DeleteConfData } from 'src/app/core/models/forms-and-components/delete-conf-data.model';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { ImageType } from 'src/app/core/models/images/image-type.model';
import { ImageProps } from 'src/app/core/models/images/image-props.model';
import { ImageService } from 'src/app/core/services/image.service';
import { ProductCardData } from 'src/app/core/models/products/product-card-data.model';
import { PageHeroData } from 'src/app/core/models/forms-and-components/page-hero-data.model';
import { BuyNowBoxData } from 'src/app/core/models/products/buy-now-box-data.model';
import { CheckoutData } from 'src/app/core/models/products/checkout-data.model';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreActions, ProductStoreSelectors } from 'src/app/root-store';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  product$: Observable<Product>;
  private productLoaded: boolean;
  cardImageProps$: Observable<ImageProps>;
  heroImageProps$: Observable<ImageProps>;
  imageUploadProcessing$: Observable<boolean>;

  productForm: FormGroup;
  minHighlightsLength = 3;
  productValidationMessages = PRODUCT_FORM_VALIDATION_MESSAGES;
  isNewProduct: boolean;

  private productId: string;
  private tempProductTitle: string;
  private originalProduct: Product;
  private productInitialized: boolean;
  private productDiscarded: boolean;
  private cardImageAdded: boolean;
  private heroImageAdded: boolean;
  private imagesModifiedSinceLastSave: boolean;
  private manualSave: boolean;

  private initProductTimeout: NodeJS.Timer; // Add "types": ["node"] to tsconfig.app.json to remove TS error from NodeJS.Timer function
  private autoSaveTicker: NodeJS.Timer; // Add "types": ["node"] to tsconfig.app.json to remove TS error from NodeJS.Timer function
  private autoSaveSubscription: Subscription;

  constructor(
    private store$: Store<RootStoreState.State>,
    private afs: AngularFirestore, // Used purely to generate ID
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.configureNewProduct();
    this.loadExistingProductData();
  }

  onSave() {
    this.manualSave = true;
    this.saveProduct();
    this.router.navigate([AppRoutes.PRODUCT_DASHBOARD]);
  }

  onDiscardEdits() {
    const dialogConfig = new MatDialogConfig();

    const deleteConfData: DeleteConfData = {
      title: 'Discard Edits',
      body: 'Are you sure you want to discard your edits?'
    };

    dialogConfig.data = deleteConfData;

    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      if (userConfirmed) {
        this.productDiscarded = true;
        this.router.navigate([AppRoutes.PRODUCT_DASHBOARD]);
        if (this.isNewProduct) {
          this.store$.dispatch(new ProductStoreActions.DeleteProductRequested({productId: this.productId}));
        } else {
          // Changes discarded, so revert to original product (with current image list)
          this.product$
            .pipe(take(1))
            .subscribe(product => {
              // Insert the latest imageFilePathList so that if item it is deleted, all images are scrubbed
              // After all, images get uploaded irrespective of if changes are discarded
              const originalItemWithCurrentImageList: Product = {
                ...this.originalProduct,
                imageFilePathList: product.imageFilePathList ? product.imageFilePathList : null
              };
              console.log('Original item to revert to', this.originalProduct);
              console.log('Original item with current image list', originalItemWithCurrentImageList);
              this.store$.dispatch(new ProductStoreActions.UpdateProductRequested({product: originalItemWithCurrentImageList}));
            });
        }
      }
    });
  }

  onAddHighlight(): void {
    this.highlights.push(this.createHighlight());
  }

  onRemoveHighlight(index: number): void {
    this.highlights.removeAt(index);
  }

  onUploadCardImage(event: any) {
    const file: File = event.target.files[0];
    this.uploadProductImage(file, ImageType.PRODUCT_CARD);
  }

  onUploadHeroImage(event: any) {
    const file: File = event.target.files[0];
    this.uploadProductImage(file, ImageType.PRODUCT_HERO);
  }

  private uploadProductImage(file: File, imageType: ImageType): void {

    // Confirm valid file type
    if (file.type.split('/')[0] !== 'image') {
      return alert('only images allowed');
    }

    this.imageUploadProcessing$ = this.imageService.getImageProcessing();

    // Initialize product if not yet done
    if (!this.productInitialized) {
      this.initializeProduct();
    } else {
      this.saveProduct();
    }

    // Upload file and get image props
    this.imageService.uploadImageAndGetProps(file, this.productId, imageType)
      .then(imageProps => {
        // Assign image props
        switch (imageType) {
          case ImageType.PRODUCT_CARD:
            this.cardImageProps$ = of(imageProps);
            this.cardImageAdded = true;
            break;
          case ImageType.PRODUCT_HERO:
            this.heroImageProps$ = of(imageProps);
            this.heroImageAdded = true;
            break;
          default:
            break;
        }
        this.imagesModifiedSinceLastSave = true; // Used for auto-save change detection only after image uploaded
        return imageProps;
      });

  }

  // This handles a weird error related to lastpass form detection when pressing enter
  // From: https://github.com/KillerCodeMonkey/ngx-quill/issues/351#issuecomment-476017960
  textareaEnterPressed($event: KeyboardEvent) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  private loadExistingProductData() {
    // Check if id params are available
    const idParamName = 'id';
    const idParam = this.route.snapshot.params[idParamName];
    if (idParam) {
      this.productInitialized = true;
      this.productId = idParam;
      console.log('Product detected with id', this.productId);
      this.product$ = this.getProduct(this.productId);

      // If product data available, patch values into form
      this.product$
        .pipe(take(1))
        .subscribe(product => {
          if (product) {
            const productFormObject = {
              name: product.name,
              price: product.price,
              listOrder: product.listOrder,
              tagline: product.tagline,
              highlights: product.productCardData.highlights,
              heroSubtitle: product.heroData.pageSubtitle,
              buyNowBoxSubtitle: product.buyNowData.subtitle,
              checkoutHeader: product.checkoutData.header,
              checkoutDescription: product.checkoutData.description,
            };

            // Add additional highlight form controls if more than min amount
            const highlightsLength = productFormObject.highlights.length;
            if (highlightsLength > this.minHighlightsLength) {
              const numberOfControlsToAdd = highlightsLength - this.minHighlightsLength;
              for (let i = 0; i < numberOfControlsToAdd; i++ ) {
                this.onAddHighlight();
              }
            }

            // Patch in form values
            this.productForm.patchValue(productFormObject);
            this.setProductImages(product);
            this.isNewProduct = false;
            this.originalProduct = product;
          }
      });
    }
  }

  private getProduct(productId: string): Observable<Product> {
    console.log('Getting product', productId);
    return this.store$.select(ProductStoreSelectors.selectProductById(productId))
    .pipe(
      withLatestFrom(
        this.store$.select(ProductStoreSelectors.selectProductsLoaded)
      ),
      map(([product, productsLoaded]) => {
        // Check if items are loaded, if not fetch from server
        if (!productsLoaded && !this.productLoaded) {
          console.log('No product in store, fetching from server', productId);
          this.store$.dispatch(new ProductStoreActions.SingleProductRequested({productId}));
        }
        console.log('Single product status', this.productLoaded);
        this.productLoaded = true; // Prevents loading from firing more than needed
        return product;
      })
    );
  }

  private setProductImages(product: Product): void {
    this.cardImageProps$ = of(product.cardImageProps);
    if (product.cardImageProps) {
      this.cardImageAdded = true;
    }

    this.heroImageProps$ = of(product.heroImageProps);
    if (product.heroImageProps) {
      this.heroImageAdded = true;
    }
  }

  private configureNewProduct() {
    this.isNewProduct = true;
    this.productId = this.afs.createId();
    this.tempProductTitle = `Untitled Product ${this.productId.substr(0, 4)}`;

    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      listOrder: ['', [Validators.required]],
      tagline: ['', [Validators.required]],
      highlights: this.fb.array([
        this.createHighlight(),
        this.createHighlight(),
        this.createHighlight(),
      ]),
      heroSubtitle: ['', [Validators.required]],
      buyNowBoxSubtitle: ['', [Validators.required]],
      checkoutHeader: ['', [Validators.required]],
      checkoutDescription: ['', [Validators.required]],
    });

    // Auto-init product if it hasn't already been initialized and it has content
    this.initProductTimeout = setTimeout(() => {
      if (!this.productInitialized) {
        this.initializeProduct();
      }
      this.createAutoSaveTicker();
    }, 5000);
  }

  private initializeProduct(): void {


    const productCardData: ProductCardData = {
      name: this.name.value,
      tagline: this.tagline.value,
      highlights: this.highlights.value,
    };

    const heroData: PageHeroData = {
      pageTitle: this.name.value,
      pageSubtitle: this.heroSubtitle.value,
    };

    const buyNowData: BuyNowBoxData = {
      title: this.name.value,
      subtitle: this.buyNowBoxSubtitle.value,
    };

    const checkoutData: CheckoutData = {
      header: this.checkoutHeader.value,
      productName: this.name.value,
      price: this.price.value,
      description: this.checkoutDescription.value,
      tagline: this.tagline.value
    };

    const product: Product = {
      id: this.productId,
      name: this.name.value ? this.name.value : this.tempProductTitle,
      price: this.price.value,
      listOrder: this.listOrder.value,
      tagline: this.tagline.value,
      productCardData,
      heroData,
      buyNowData,
      checkoutData,
    };
    this.store$.dispatch(new ProductStoreActions.AddProductRequested({product}));
    this.productInitialized = true;
    console.log('Product initialized');
  }

  private createAutoSaveTicker() {
    // Set interval at 10 seconds
    const step = 10000;

    this.autoSaveSubscription = this.getProduct(this.productId)
      .subscribe(product => {
        if (this.autoSaveTicker) {
          // Clear old interval
          this.killAutoSaveTicker();
          console.log('clearing old interval');
        }
        if (product) {
          // Refresh interval every 10 seconds
          console.log('Creating autosave ticker');
          this.autoSaveTicker = setInterval(() => {
            this.autoSave(product);
          }, step);
        }
      });

  }

  private autoSave(product: Product) {
    // Cancel autosave if no changes to content
    if (!this.changesDetected(product)) {
      console.log('No changes to content, no auto save');
      return;
    }
    this.saveProduct();
    console.log('Auto saving');
  }

  private changesDetected(product: Product): boolean {
    if (
      (product.name === this.name.value || product.name === this.tempProductTitle) &&
      product.price === this.price.value &&
      product.listOrder === this.listOrder.value &&
      product.tagline === this.tagline.value &&
      this.sortedArraysEqual(product.productCardData.highlights, this.highlights.value) &&
      product.heroData.pageSubtitle === this.heroSubtitle.value &&
      product.buyNowData.subtitle === this.buyNowBoxSubtitle.value &&
      product.checkoutData.header === this.checkoutHeader.value &&
      product.checkoutData.description === this.checkoutDescription.value &&
      !this.imagesModifiedSinceLastSave
    ) {
      return false;
    }
    return true;
  }

  private productIsBlank(): boolean {
    if (
      this.cardImageAdded ||
      this.heroImageAdded ||
      this.name.value ||
      this.price.value ||
      this.listOrder.value ||
      !this.highlightsArrayIsBlank() ||
      this.tagline.value ||
      this.checkoutHeader.value ||
      this.checkoutDescription.value ||
      this.imagesModifiedSinceLastSave
    ) {
      return false;
    }
    console.log('Product is blank');
    return true;
  }

  private readyToActivate(): boolean {
    if (
      !this.cardImageAdded ||
      !this.heroImageAdded ||
      this.productForm.invalid
    ) {
      console.log('Product not ready to activate');
      return false;
    }
    console.log('Product is ready to activate');
    return true;
  }

  private saveProduct() {
    const productCardData: ProductCardData = {
      name: this.name.value,
      tagline: this.tagline.value,
      highlights: this.highlights.value,
    };

    const heroData: PageHeroData = {
      pageTitle: this.name.value,
      pageSubtitle: this.heroSubtitle.value,
    };

    const buyNowData: BuyNowBoxData = {
      title: this.name.value,
      subtitle: this.buyNowBoxSubtitle.value,
    };

    const checkoutData: CheckoutData = {
      header: this.checkoutHeader.value,
      productName: this.name.value,
      price: this.price.value,
      description: this.checkoutDescription.value,
      tagline: this.tagline.value
    };

    const product: Product = {
      id: this.productId,
      name: this.name.value ? this.name.value : this.tempProductTitle,
      price: this.price.value,
      listOrder: this.listOrder.value,
      tagline: this.tagline.value,
      productCardData,
      heroData,
      buyNowData,
      checkoutData,
      readyToActivate: this.readyToActivate(),
    };
    this.store$.dispatch(new ProductStoreActions.UpdateProductRequested({product}));
    console.log('Product saved', product);
    this.imagesModifiedSinceLastSave = false; // Reset image change detection
  }

  // Courtesy of: https://stackoverflow.com/a/4025958/6572208
  private sortedArraysEqual(arr1: string[], arr2: []) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
  }

  private highlightsArrayIsBlank(): boolean {
    let isBlank = true;
    this.highlightsArray.map(highlight => {
      if (highlight) {
        console.log('Highlight value detected');
        isBlank = false;
      }
    });
    return isBlank;
  }

  private createHighlight(): FormControl {
    return this.fb.control('', Validators.required);
  }


  private killAutoSaveTicker(): void {
    clearInterval(this.autoSaveTicker);
  }

  private killInitProductTimeout(): void {
    clearTimeout(this.initProductTimeout);
  }

  get name() { return this.productForm.get('name'); }
  get price() { return this.productForm.get('price'); }
  get listOrder() { return this.productForm.get('listOrder'); }
  get tagline() { return this.productForm.get('tagline'); }
  get highlights() { return this.productForm.get('highlights') as FormArray; }
  get highlightsArray(): string[] {
    return this.highlights.controls.map(control => {
      return control.value;
    });
  }
  get heroSubtitle() { return this.productForm.get('heroSubtitle'); }
  get buyNowBoxSubtitle() { return this.productForm.get('buyNowBoxSubtitle'); }
  get checkoutHeader() { return this.productForm.get('checkoutHeader'); }
  get checkoutDescription() { return this.productForm.get('checkoutDescription'); }

  ngOnDestroy(): void {
    // Auto save product if navigating away
    if (this.productInitialized && !this.productDiscarded && !this.manualSave && !this.productIsBlank()) {
      this.saveProduct();
    }

    // Delete product if blank
    if (this.productInitialized && this.productIsBlank() && !this.productDiscarded) {
      console.log('Deleting blank product');
      this.store$.dispatch(new ProductStoreActions.DeleteProductRequested({productId: this.productId}));
    }

    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }

    if (this.autoSaveTicker) {
      this.killAutoSaveTicker();
    }

    if (this.initProductTimeout) {
      this.killInitProductTimeout();
    }
  }

}
