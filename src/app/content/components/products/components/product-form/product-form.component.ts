import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PRODUCT_FORM_VALIDATION_MESSAGES } from 'src/app/core/models/forms/validation-messages.model';
import { Subscription, Observable, of, from } from 'rxjs';
import { Product } from 'src/app/core/models/products/product.model';
import { take } from 'rxjs/operators';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { DeleteConfData } from 'src/app/core/models/forms/delete-conf-data.model';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { ImageType } from 'src/app/core/models/images/image-type.model';
import { ImageProps } from 'src/app/core/models/images/image-props.model';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  productData$: Observable<Product>;
  imageProps$: Observable<ImageProps>;
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
  private imageAdded: boolean;
  private manualSave: boolean;

  private initProductTimeout: NodeJS.Timer;
  // Add "types": ["node"] to tsconfig.app.json to remove TS error from NodeJS.Timer function
  private autoSaveTicker: NodeJS.Timer;
  private autoSaveSubscription: Subscription;

  constructor(
    private productService: ProductService,
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
          this.productService.deleteProduct(this.productId);
        } else {
          this.productData$
            .pipe(take(1))
            .subscribe(product => {
              const originalItemWithCurrentImageList: Product = {
                ...this.originalProduct,
                imageFilePathList: product.imageFilePathList
              };
              this.productService.updateProduct(originalItemWithCurrentImageList);
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

  onUploadProductImage(event: any): void {
    const file: File = event.target.files[0];

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
    this.imageProps$ = from(this.imageService.uploadImageAndGetProps(file, this.productId, ImageType.PRODUCT));

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
      this.productData$ = this.productService.fetchSingleProduct(this.productId);

      // If post data available, patch values into form
      this.productData$
        .pipe(take(1))
        .subscribe(product => {
          if (product) {
            const productObject: Product = {
              id: product.id,
              name: product.name,
              price: product.price,
              checkoutHeader: product.checkoutHeader,
              description: product.description,
              mdBlurb: product.mdBlurb,
              highlights: product.highlights
            };

            // Add additional highlight form controls if more than min amount
            const highlightsLength = productObject.highlights.length;
            if (highlightsLength > this.minHighlightsLength) {
              const numberOfControlsToAdd = highlightsLength - this.minHighlightsLength;
              for (let i = 0; i < numberOfControlsToAdd; i++ ) {
                this.onAddHighlight();
              }
            }

            this.productForm.patchValue(productObject);
            console.log('Initializing with these image props', product.imageProps);
            this.imageProps$ = of(product.imageProps);
            if (product.imageProps) {
              this.imageAdded = true;
            }
            this.isNewProduct = false;
            this.originalProduct = product;
          }
      });
    }
  }

  private configureNewProduct() {
    this.isNewProduct = true;
    this.productId = this.productService.generateNewId();
    this.tempProductTitle = `Untitled Product ${this.productId.substr(0, 4)}`;

    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      checkoutHeader: ['', [Validators.required]],
      description: ['', [Validators.required]],
      mdBlurb: ['', [Validators.required]],
      highlights: this.fb.array([
        this.createHighlight(),
        this.createHighlight(),
        this.createHighlight(),
      ]),
    });

    // Auto-init post if it hasn't already been initialized and it has content
    this.initProductTimeout = setTimeout(() => {
      if (!this.productInitialized) {
        this.initializeProduct();
      }
      this.createAutoSaveTicker();
    }, 5000);
  }

  private initializeProduct(): void {
    const product: Product = {
      id: this.productId,
      name: this.name.value ? this.name.value : this.tempProductTitle,
      price: this.price.value,
      checkoutHeader: this.checkoutHeader.value,
      description: this.description.value,
      mdBlurb: this.mdBlurb.value,
      highlights: this.highlights.value,
    };
    this.productService.createProduct(product);
    this.productInitialized = true;
    console.log('Product initialized');
  }

  private createAutoSaveTicker() {
    // Set interval at 10 seconds
    const step = 10000;


    // TODO: FIGURE OUT WHY THIS IS FETCHING THE PRODUCT A SECOND TIME

    this.autoSaveSubscription = this.productService.fetchSingleProduct(this.productId)
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
    console.log('Auto saving post');
  }

  private changesDetected(product: Product): boolean {
    if (
      (product.name === this.name.value || product.name === this.tempProductTitle) &&
      product.price === this.price.value &&
      product.checkoutHeader === this.checkoutHeader.value &&
      product.description === this.description.value &&
      product.mdBlurb === this.mdBlurb.value &&
      this.sortedArraysEqual(product.highlights, this.highlights.value)
    ) {
      return false;
    }
    return true;
  }

  private productIsBlank(): boolean {
    if (
      this.imageAdded ||
      this.name.value ||
      this.price.value ||
      this.checkoutHeader.value ||
      this.description.value ||
      this.mdBlurb.value ||
      !this.highlightsArrayIsBlank()
    ) {
      return false;
    }
    console.log('Post is blank');
    return true;
  }

  private readyToActivate(): boolean {
    if (
      !this.imageAdded ||
      !this.name.value ||
      !this.price.value ||
      !this.checkoutHeader.value ||
      !this.description.value ||
      !this.mdBlurb.value ||
      this.highlightsArrayHasBlankValue()
    ) {
      console.log('Post not ready to activate');
      return false;
    }
    console.log('Post is ready to activate');
    return true;
  }

  private saveProduct() {
    const product: Product = {
      id: this.productId,
      name: this.name.value ? this.name.value : this.tempProductTitle,
      price: this.price.value,
      checkoutHeader: this.checkoutHeader.value,
      description: this.description.value,
      mdBlurb: this.mdBlurb.value,
      highlights: this.highlights.value,
      readyToActivate: this.readyToActivate(),
    };
    this.productService.updateProduct(product);
    console.log('Product saved', product);
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

  private highlightsArrayHasBlankValue(): boolean {
    let hasBlankValue = false;
    this.highlightsArray.map(highlight => {
      if (!highlight) {
        console.log('Blank highlight value detected');
        hasBlankValue = true;
      }
    });
    return hasBlankValue;
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

  get id() { return this.productForm.get('id'); }
  get name() { return this.productForm.get('name'); }
  get price() { return this.productForm.get('price'); }
  get checkoutHeader() { return this.productForm.get('checkoutHeader'); }
  get description() { return this.productForm.get('description'); }
  get mdBlurb() { return this.productForm.get('mdBlurb'); }
  get highlights() { return this.productForm.get('highlights') as FormArray; }
  get highlightsArray(): string[] {
    return this.highlights.controls.map(control => {
      return control.value;
    });
  }

  ngOnDestroy(): void {
    if (this.productInitialized && !this.productDiscarded && !this.manualSave && !this.productIsBlank()) {
      this.saveProduct();
    }

    if (this.productInitialized && this.productIsBlank() && !this.productDiscarded) {
      console.log('Deleting blank product');
      this.productService.deleteProduct(this.productId);
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
