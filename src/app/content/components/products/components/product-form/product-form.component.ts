import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PRODUCT_FORM_VALIDATION_MESSAGES } from 'src/app/core/models/forms/validation-messages.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  productId: string;
  tempPostTitle: string;

  productValidationMessages = PRODUCT_FORM_VALIDATION_MESSAGES;

  isNewProduct: boolean;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.configureNewProduct();
  }

  onSave() {
    console.log('Product form', this.productForm.value);
    console.log('Highlights array', this.highlightsArray);
  }

  private configureNewProduct() {
    this.isNewProduct = true;
    this.productId = this.productService.generateNewId();
    this.tempPostTitle = `Untitled Product ${this.productId.substr(0, 4)}`;

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
      active: [false, [Validators.required]],
    });
  }

  private createHighlight(): FormControl {
    return this.fb.control('', Validators.required);
  }

  onAddHighlight(): void {
    this.highlights.push(this.createHighlight());
  }

  onRemoveHighlight(index: number): void {
    this.highlights.removeAt(index);
  }





  get id() { return this.productForm.get('id'); }
  get name() { return this.productForm.get('name'); }
  get price() { return this.productForm.get('price'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }
  get checkoutHeader() { return this.productForm.get('checkoutHeader'); }
  get description() { return this.productForm.get('description'); }
  get mdBlurb() { return this.productForm.get('mdBlurb'); }
  get highlights() { return this.productForm.get('highlights') as FormArray; }
  get active() { return this.productForm.get('active'); }
  get highlightsArray(): string[] {
    return this.highlights.controls.map(control => {
      return control.value;
    });
  }

}
