import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig, MatSelectChange } from '@angular/material';
import { Subscription, Observable, of } from 'rxjs';
import { take, withLatestFrom, map, takeWhile, skipWhile, debounceTime, tap } from 'rxjs/operators';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { ImageService } from 'src/app/core/services/image.service';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreActions, ProductStoreSelectors } from 'src/app/root-store';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Product, ProductKeys, ProductCategory, ProductCategoryList } from 'shared-models/products/product.model';
import { ImageProps } from 'shared-models/images/image-props.model';
import { PRODUCT_FORM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { AdminAppRoutes, PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { DeleteConfData } from 'shared-models/forms-and-components/delete-conf-data.model';
import { ImageType } from 'shared-models/images/image-type.model';
import { ProductCardData, ProductCardKeys } from 'shared-models/products/product-card-data.model';
import { PageHeroData, PageHeroKeys } from 'shared-models/forms-and-components/page-hero-data.model';
import { BuyNowBoxData, BuyNowBoxKeys } from 'shared-models/products/buy-now-box-data.model';
import { CheckoutData, CheckoutKeys } from 'shared-models/products/checkout-data.model';
import { EditorSessionService } from 'src/app/core/services/editor-session.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  appRoutes = PublicAppRoutes;

  product$: Observable<Product>;
  private productLoaded: boolean;
  cardImageProps$: Observable<ImageProps>;
  heroImageProps$: Observable<ImageProps>;
  imageUploadProcessing$: Observable<boolean>;

  productForm: FormGroup;
  minHighlightsLength = 3;
  productValidationMessages = PRODUCT_FORM_VALIDATION_MESSAGES;
  isNewProduct: boolean;
  productCategories: ProductCategory[] = ProductCategoryList;
  loadingExistingProduct: boolean;

  private productId: string;
  private tempProductTitle: string;
  private originalProduct: Product;
  productInitialized: boolean;
  private productDiscarded: boolean;
  private cardImageAdded: boolean;
  private heroImageAdded: boolean;
  private imagesModifiedSinceLastSave: boolean;
  private manualSave: boolean;

  private saveProductSubscription: Subscription;
  isSavingProduct$: Observable<boolean>;
  private deleteProductSubscription: Subscription;
  isDeletingProduct$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private editorSessionService: EditorSessionService
  ) { }

  ngOnInit() {
    this.configureNewProduct();
    this.loadExistingProductData();
    this.monitorFormChanges();
  }

  private createEditorSession(docId: string) {
    this.editorSessionService.createEditorSession(docId);
  }

  private updateEditorSession() {
    this.editorSessionService.updateEditorSession();
  }

  // Keeps track of user changes and triggers auto save
  private monitorFormChanges() {
    this.productForm.valueChanges
      .pipe(
        skipWhile(() => this.loadingExistingProduct), // Prevents this from firing when patching in existing data
        debounceTime(1000)
      )
      .subscribe(valueChange => {
        console.log('Logging form value change', valueChange);
        if (!this.productInitialized) {
          this.initializeProduct();
        }
        this.productForm.markAsTouched(); // Edits in the text editor don't automatically cause form to be touched until clicking out
        this.saveProduct();
      });
  }

  onSave() {
    this.manualSave = true;
    this.saveProduct();
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
        // If new item, delete it entirely
        if (this.isNewProduct) {
          if (this.deleteProductSubscription) {
            this.deleteProductSubscription.unsubscribe();
          }
          this.store$.dispatch(new ProductStoreActions.DeleteProductRequested({productId: this.productId}));
          this.reactToDeletOutcome();
        } else {
          if (this.saveProductSubscription) {
            this.saveProductSubscription.unsubscribe();
          }
          // If existing item, revert to original version (but use current image list)
          this.product$
            .pipe(take(1))
            .subscribe(product => {
              // Insert the latest imageFilePathList so that if item it is deleted, all images are scrubbed
              // After all, images get uploaded irrespective of if changes are discarded
              const originalItemWithCurrentImageList: Product = {
                ...this.originalProduct,
                imageFilePathList: product.imageFilePathList ? product.imageFilePathList : null
              };
              console.log('Reverting to original item with current image list', originalItemWithCurrentImageList);
              this.store$.dispatch(new ProductStoreActions.RollbackProductRequested({product: originalItemWithCurrentImageList}));
              this.reactToSaveOutcome(product);
            });
        }
      }
    });
  }

  onAddHighlight(): void {
    this[ProductCardKeys.HIGHLIGHTS].push(this.createHighlight());
  }

  onRemoveHighlight(index: number): void {
    this[ProductCardKeys.HIGHLIGHTS].removeAt(index);
  }

  onUploadCardImage(event: any) {
    const file: File = event.target.files[0];
    this.uploadProductImage(file, ImageType.PRODUCT_CARD);
  }

  onUploadHeroImage(event: any) {
    const file: File = event.target.files[0];
    this.uploadProductImage(file, ImageType.PRODUCT_HERO);
  }

  updateProductCategory(event: MatSelectChange) {
    console.log('Product category updated', event.value);
    this.productForm.patchValue({
      [ProductKeys.PRODUCT_CATEGORY]: event.value
    });
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
      this.loadingExistingProduct = true; // Pauses the monitorChanges observable
      this.productInitialized = true;
      this.productId = idParam;
      console.log('Product detected with id', this.productId);
      this.product$ = this.getProduct(this.productId);

      // If product data available, patch values into form
      this.product$
        .pipe(
          takeWhile( item => !this.originalProduct) // Take until an item is loaded into memory
        )
        .subscribe(product => {
          if (product) {
            const productFormObject = {
              [ProductKeys.NAME]: product[ProductKeys.NAME],
              [ProductKeys.PRICE]: product[ProductKeys.PRICE],
              [ProductKeys.LIST_ORDER]: product[ProductKeys.LIST_ORDER],
              [ProductKeys.TAGLINE]: product[ProductKeys.TAGLINE],
              [ProductKeys.PRODUCT_CATEGORY]: product[ProductKeys.PRODUCT_CATEGORY],
              [ProductCardKeys.HIGHLIGHTS]: product.productCardData[ProductCardKeys.HIGHLIGHTS],
              [PageHeroKeys.PAGE_HERO_SUBTITLE]: product.heroData[PageHeroKeys.PAGE_HERO_SUBTITLE],
              [BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE]: product.buyNowData[BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE],
              [CheckoutKeys.CHECKOUT_HEADER]: product.checkoutData[CheckoutKeys.CHECKOUT_HEADER],
              [CheckoutKeys.CHECKOUT_DESCRIPTION]: product.checkoutData[CheckoutKeys.CHECKOUT_DESCRIPTION],
            };

            // Add additional highlight form controls if more than min amount
            const highlightsLength = productFormObject[ProductCardKeys.HIGHLIGHTS].length;
            if (highlightsLength > this.minHighlightsLength) {
              const numberOfControlsToAdd = highlightsLength - this.minHighlightsLength;
              for (let i = 0; i < numberOfControlsToAdd; i++ ) {
                this.onAddHighlight();
              }
            }

            // Patch in form values
            console.log('Patching post data into form', productFormObject);
            this.productForm.patchValue(productFormObject);
            this.setProductImages(product);
            this.isNewProduct = false;
            this.originalProduct = product;
            this.createEditorSession(product.id); // Trigger the start of this editing session
            this.loadingExistingProduct = false; // unpauses the monitorChanges observable
          }
      });
    }
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
        this.productLoaded = true; // Prevents loading from firing more than needed
        return product;
      })
    );
  }

  private configureNewProduct() {
    this.isNewProduct = true;
    this.productId = `${this.utilsService.generateRandomCharacterNoCaps(8)}`; // Use custom ID creator to avoid caps in URLs
    this.tempProductTitle = `Untitled Product ${this.productId.substr(0, 4)}`;

    this.productForm = this.fb.group({
      [ProductKeys.NAME]: ['', [Validators.required]],
      [ProductKeys.PRICE]: ['', [Validators.required]],
      [ProductKeys.LIST_ORDER]: ['', [Validators.required]],
      [ProductKeys.TAGLINE]: ['', [Validators.required]],
      [ProductKeys.PRODUCT_CATEGORY]: ['', [Validators.required]],
      [ProductCardKeys.HIGHLIGHTS]: this.fb.array([
        this.createHighlight(),
        this.createHighlight(),
        this.createHighlight(),
      ]),
      [PageHeroKeys.PAGE_HERO_SUBTITLE]: ['', [Validators.required]],
      [BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE]: ['', [Validators.required]],
      [CheckoutKeys.CHECKOUT_HEADER]: ['', [Validators.required]],
      [CheckoutKeys.CHECKOUT_DESCRIPTION]: ['', [Validators.required]],
    });
  }

  // Won't fire if this is not a new post
  private initializeProduct(): void {

    const productName = (this[ProductKeys.NAME].value as string).trim();

    const productCardData: ProductCardData = {
      [ProductCardKeys.HIGHLIGHTS]: this[ProductCardKeys.HIGHLIGHTS].value,
    };

    const heroData: PageHeroData = {
      pageTitle: productName,
      [PageHeroKeys.PAGE_HERO_SUBTITLE]: this[PageHeroKeys.PAGE_HERO_SUBTITLE].value,
    };

    const buyNowData: BuyNowBoxData = {
      title: productName,
      [BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE]: this[BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE].value,
    };

    const checkoutData: CheckoutData = {
      [CheckoutKeys.CHECKOUT_HEADER]: this[CheckoutKeys.CHECKOUT_HEADER].value,
      [CheckoutKeys.CHECKOUT_DESCRIPTION]: this[CheckoutKeys.CHECKOUT_DESCRIPTION].value,
    };

    const product: Product = {
      id: this.productId,
      [ProductKeys.NAME]: this[ProductKeys.NAME].value ? productName : this.tempProductTitle,
      [ProductKeys.PRICE]: this[ProductKeys.PRICE].value,
      [ProductKeys.LIST_ORDER]: this[ProductKeys.LIST_ORDER].value,
      [ProductKeys.TAGLINE]: this[ProductKeys.TAGLINE].value,
      [ProductKeys.PRODUCT_CATEGORY]: this[ProductKeys.PRODUCT_CATEGORY].value,
      productCardData,
      heroData,
      buyNowData,
      checkoutData,
    };
    this.store$.dispatch(new ProductStoreActions.UpdateProductRequested({product}));
    this.productInitialized = true;
    console.log('Product initialized');
    this.createEditorSession(this.productId);
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

    // if (this.saveProductSubscription) {
    //   this.saveProductSubscription.unsubscribe();
    // }

    const productName = (this[ProductKeys.NAME].value as string).trim();

    const productCardData: ProductCardData = {
      [ProductCardKeys.HIGHLIGHTS]: this[ProductCardKeys.HIGHLIGHTS].value,
    };

    const heroData: PageHeroData = {
      pageTitle: productName,
      [PageHeroKeys.PAGE_HERO_SUBTITLE]: this[PageHeroKeys.PAGE_HERO_SUBTITLE].value,
    };

    const buyNowData: BuyNowBoxData = {
      title: productName,
      [BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE]: this[BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE].value,
    };

    const checkoutData: CheckoutData = {
      [CheckoutKeys.CHECKOUT_HEADER]: this[CheckoutKeys.CHECKOUT_HEADER].value,
      [CheckoutKeys.CHECKOUT_DESCRIPTION]: this[CheckoutKeys.CHECKOUT_DESCRIPTION].value,
    };

    const product: Product = {
      id: this.productId,
      [ProductKeys.NAME]: this[ProductKeys.NAME].value ? productName : this.tempProductTitle,
      [ProductKeys.PRICE]: this[ProductKeys.PRICE].value,
      [ProductKeys.LIST_ORDER]: this[ProductKeys.LIST_ORDER].value,
      [ProductKeys.TAGLINE]: this[ProductKeys.TAGLINE].value,
      [ProductKeys.PRODUCT_CATEGORY]: this[ProductKeys.PRODUCT_CATEGORY].value,
      productCardData,
      heroData,
      buyNowData,
      checkoutData,
      readyToActivate: this.readyToActivate(),
    };

    this.store$.dispatch(new ProductStoreActions.UpdateProductRequested({product}));

    this.reactToSaveOutcome(product);
  }

  private reactToSaveOutcome(product: Product) {
    this.saveProductSubscription = this.store$.select(ProductStoreSelectors.selectIsSaving)
      .pipe(
        withLatestFrom(
          this.store$.select(ProductStoreSelectors.selectSaveError)
        ),
        tap(([isSaving, saveError]) => {
          this.isSavingProduct$ = of(isSaving);
        })
      )
      .subscribe(([isSaving, saveError]) => {
        console.log('React to save outcome subscription firing');
        if (!isSaving && !saveError) {
          console.log('Product saved', product);
          // Navigate to dashboard if save is complete and is a manual save
          if (this.manualSave || this.productDiscarded) {
            this.router.navigate([AdminAppRoutes.PRODUCT_DASHBOARD]);
          }
          this.saveProductSubscription.unsubscribe();
        }
        if (saveError) {
          console.log('Error saving coupon');
          this.productDiscarded = false;
          this.saveProductSubscription.unsubscribe();
        }
      });
  }

  private reactToDeletOutcome() {
    this.deleteProductSubscription = this.store$.select(ProductStoreSelectors.selectIsDeleting)
      .pipe(
        withLatestFrom(
          this.store$.select(ProductStoreSelectors.selectDeleteError)
        ),
        tap(([isDeleting, deleteError]) => {
          this.isDeletingProduct$ = of(isDeleting);
        })
      )
      .subscribe(([isDeleting, deleteError]) => {
        if (!isDeleting && !deleteError) {
          console.log('Product deleted', this.productId);
          // Navigate to dashboard if save is complete and is a manual save
          if (this.productDiscarded) {
            this.router.navigate([AdminAppRoutes.PRODUCT_DASHBOARD]);
          }
          this.deleteProductSubscription.unsubscribe();
        }
        if (deleteError) {
          console.log('Error deleting post');
          this.productDiscarded = false;
          this.deleteProductSubscription.unsubscribe();
        }
      });
  }

  private createHighlight(): FormControl {
    return this.fb.control('', Validators.required);
  }

  get [ProductKeys.NAME]() { return this.productForm.get(ProductKeys.NAME); }
  get [ProductKeys.PRICE]() { return this.productForm.get(ProductKeys.PRICE); }
  get [ProductKeys.LIST_ORDER]() { return this.productForm.get(ProductKeys.LIST_ORDER); }
  get [ProductKeys.TAGLINE]() { return this.productForm.get(ProductKeys.TAGLINE); }
  get [ProductKeys.PRODUCT_CATEGORY]() { return this.productForm.get(ProductKeys.PRODUCT_CATEGORY); }
  get [ProductCardKeys.HIGHLIGHTS]() { return this.productForm.get(ProductCardKeys.HIGHLIGHTS) as FormArray; }
  get highlightsArray(): string[] {
    return this[ProductCardKeys.HIGHLIGHTS].controls.map(control => {
      return control.value;
    });
  }
  get [PageHeroKeys.PAGE_HERO_SUBTITLE]() { return this.productForm.get(PageHeroKeys.PAGE_HERO_SUBTITLE); }
  get [BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE]() { return this.productForm.get(BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE); }
  get [CheckoutKeys.CHECKOUT_HEADER]() { return this.productForm.get(CheckoutKeys.CHECKOUT_HEADER); }
  get [CheckoutKeys.CHECKOUT_DESCRIPTION]() { return this.productForm.get(CheckoutKeys.CHECKOUT_DESCRIPTION); }

  ngOnDestroy(): void {

    this.editorSessionService.destroyComponentActions(); // Signals unsubscribe in service from all relevant subscriptions

    // Save post when user navigates away without saving manually
    if (
        this.productInitialized &&
        !this.productDiscarded &&
        !this.manualSave &&
        this.productForm.touched &&
        !this.editorSessionService.autoDisconnectDetected
      ) {
      this.saveProduct();
    }

    if (this.saveProductSubscription) {
      this.saveProductSubscription.unsubscribe();
    }

    if (this.deleteProductSubscription) {
      this.deleteProductSubscription.unsubscribe();
    }
  }

}
