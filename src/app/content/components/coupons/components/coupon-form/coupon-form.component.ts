import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { COUPON_FORM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { Store } from '@ngrx/store';
import {
  RootStoreState,
  UserStoreSelectors,
  CouponStoreActions,
  CouponStoreSelectors,
  ProductStoreSelectors,
  ProductStoreActions
} from 'src/app/root-store';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { take, withLatestFrom, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DiscountCouponParent, DiscountCouponKeys } from 'shared-models/billing/discount-coupon.model';
import { Product } from 'shared-models/products/product.model';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.scss']
})
export class CouponFormComponent implements OnInit, OnDestroy {

  adminUser$: Observable<AdminUser>;
  products$: Observable<Product[]>;

  formTitle = 'Create Coupon';
  couponForm: FormGroup;
  couponValidationMessages = COUPON_FORM_VALIDATION_MESSAGES;
  minDate = new Date(moment.now());
  useTouchUi: boolean;
  isNewCoupon: boolean;
  screenObserverSubscription: Subscription;
  saveCouponSubscription: Subscription;

  constructor(
    private store$: Store<RootStoreState.State>,
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<CouponFormComponent>,
    @Inject(MAT_DIALOG_DATA) private existingCoupon: DiscountCouponParent,
    private uiService: UiService
  ) { }

  ngOnInit() {

    this.configureNewCoupon();
    this.configDatePickerType();
    this.initializeProducts(); // Ensures this is available for productIdToName pipe
    this.adminUser$ = this.store$.select(UserStoreSelectors.selectUser);

    if (this.existingCoupon) {
      console.log('Existing coupon data exists, patching values');
      this.formTitle = 'Edit Coupon';
      this.loadExistingCouponData(); // Only loads if exists
    }

  }

  onToggleUserSpecific(event: MatSlideToggleChange) {
    if (event.checked) {
      this.setMaxUsesPerUserValidators();
    } else {
      this.clearMaxUsesPerUserValidators();
    }
  }

  onSave() {
    if (this.couponForm.valid) {
      this.saveCoupon();
    }
  }

  onClose() {
    this.dialogRef.close(false);
  }

  private initializeProducts() {
    this.products$ = this.store$.select(ProductStoreSelectors.selectAllProducts)
      .pipe(
        withLatestFrom(
          this.store$.select(ProductStoreSelectors.selectProductsLoaded)
        ),
        map(([products, productsLoaded]) => {
          // Check if items are loaded, if not fetch from server
          if (!productsLoaded) {
            this.store$.dispatch(new ProductStoreActions.AllProductsRequested());
          }
          return products;
        })
      );
  }

  private configureNewCoupon() {

    this.couponForm = this.fb.group({
      // Regex courtesy of https://stackoverflow.com/questions/388996/regex-for-javascript-to-allow-only-alphanumeric
      [DiscountCouponKeys.COUPON_CODE]: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+$/i)]],
      [DiscountCouponKeys.DISCOUNT_PERCENTAGE]: ['', [Validators.required, Validators.max(100), Validators.min(1)]],
      [DiscountCouponKeys.EXPIRATION_DATE]: [moment.now(), [Validators.required]],
      expirationHour: [0, [Validators.min(0), Validators.max(23)]], // Datepicker doesn't have time of day by default
      expirationMin: [0, [Validators.min(0), Validators.max(59)]], // Datepicker doesn't have time of day by default
      [DiscountCouponKeys.MAX_USES]: ['', [Validators.required, Validators.min(1)]],
      [DiscountCouponKeys.USER_SPECIFIC]: [false, [Validators.required]],
      [DiscountCouponKeys.PRODUCT_SPECIFIC]: [false, [Validators.required]],
      [DiscountCouponKeys.MAX_USES_PER_USER]: [null], // Validators set after form is created
      [DiscountCouponKeys.APPROVED_PRODUCT_IDS]: [[]]
    });

    this.isNewCoupon = true;

    // Ensures max uses per user doesn't exceed overall max uses
    this.bindMaxUsesPerUserToOverallMaxUses();

  }

  // Configure max uses
  private setMaxUsesPerUserValidators() {
    // Only apply if userSpecific is selected
    if (this[DiscountCouponKeys.USER_SPECIFIC].value) {
      const maxValue = this[DiscountCouponKeys.MAX_USES].value ? this[DiscountCouponKeys.MAX_USES].value : null;
      this[DiscountCouponKeys.MAX_USES_PER_USER].setValidators([Validators.required, Validators.min(1), Validators.max(maxValue)]);
      this[DiscountCouponKeys.MAX_USES_PER_USER].updateValueAndValidity();
    }
  }

  private clearMaxUsesPerUserValidators() {
    this[DiscountCouponKeys.MAX_USES_PER_USER].setValidators(null);
    this[DiscountCouponKeys.MAX_USES_PER_USER].updateValueAndValidity();
  }


  // Update maxUsesPerUser whenever maxUses is updated
  private bindMaxUsesPerUserToOverallMaxUses() {
    this[DiscountCouponKeys.MAX_USES].valueChanges.subscribe(value => {
      this.setMaxUsesPerUserValidators();
    });
  }

  private configDatePickerType() {
    // Set Date picker type based on mobile or desktop
    this.screenObserverSubscription = this.uiService.screenIsMobile$
      .subscribe(screenIsMobile => {
        if (screenIsMobile) {
          this.useTouchUi = true;
        } else {
          this.useTouchUi = false;
        }
        console.log('Setting touch ui to', this.useTouchUi);
      });
  }

  private loadExistingCouponData() {

    this.isNewCoupon = false;

    const patchFormData: Partial<DiscountCouponParent> = {
      [DiscountCouponKeys.COUPON_CODE]: this.existingCoupon[DiscountCouponKeys.COUPON_CODE],
      [DiscountCouponKeys.DISCOUNT_PERCENTAGE]: this.existingCoupon[DiscountCouponKeys.DISCOUNT_PERCENTAGE] * 100,
      [DiscountCouponKeys.EXPIRATION_DATE]: this.existingCoupon[DiscountCouponKeys.EXPIRATION_DATE],
      [DiscountCouponKeys.MAX_USES]: this.existingCoupon[DiscountCouponKeys.MAX_USES],
      [DiscountCouponKeys.USER_SPECIFIC]: this.existingCoupon[DiscountCouponKeys.USER_SPECIFIC],
      [DiscountCouponKeys.PRODUCT_SPECIFIC]: this.existingCoupon[DiscountCouponKeys.PRODUCT_SPECIFIC],
      // tslint:disable-next-line:max-line-length
      [DiscountCouponKeys.MAX_USES_PER_USER]: this.existingCoupon[DiscountCouponKeys.MAX_USES_PER_USER] ? this.existingCoupon[DiscountCouponKeys.MAX_USES_PER_USER] : 0,
      // tslint:disable-next-line:max-line-length
      [DiscountCouponKeys.APPROVED_PRODUCT_IDS]: this.existingCoupon[DiscountCouponKeys.APPROVED_PRODUCT_IDS] ? this.existingCoupon[DiscountCouponKeys.APPROVED_PRODUCT_IDS] : []
    };

    // Convert the datestring to segments to fill form fields properly
    const dateString = this.existingCoupon[DiscountCouponKeys.EXPIRATION_DATE];
    const patchFormDataWithDatePickerFormats = {
      ...patchFormData,
      [DiscountCouponKeys.EXPIRATION_DATE]: moment(dateString),
      expirationHour: moment(dateString).hours(),
      expirationMin: moment(dateString).minutes()
    };


    this.couponForm.patchValue(patchFormDataWithDatePickerFormats);
    this[DiscountCouponKeys.COUPON_CODE].disable(); // Prevent code from being edited

    // Set base validator upon initialization if a value exists
    this.setMaxUsesPerUserValidators();

    if (this.couponForm.invalid) {
      const formErrors = this.couponForm.errors;
      console.log('Found these form errors', formErrors);
    }
  }

  private saveCoupon() {
    this.adminUser$
    .pipe(take(1))
    .subscribe(publicUser => {
      const coupon: DiscountCouponParent = {
        [DiscountCouponKeys.COUPON_CODE]: (this[DiscountCouponKeys.COUPON_CODE].value as string).trim(),
        [DiscountCouponKeys.DISCOUNT_PERCENTAGE]: this[DiscountCouponKeys.DISCOUNT_PERCENTAGE].value / 100,
        [DiscountCouponKeys.EXPIRATION_DATE]: this.calculateExpirationDate(),
        [DiscountCouponKeys.MAX_USES]: this[DiscountCouponKeys.MAX_USES].value,
        [DiscountCouponKeys.USER_SPECIFIC]: this[DiscountCouponKeys.USER_SPECIFIC].value,
        [DiscountCouponKeys.PRODUCT_SPECIFIC]: this[DiscountCouponKeys.PRODUCT_SPECIFIC].value,
        // tslint:disable-next-line:max-line-length
        [DiscountCouponKeys.MAX_USES_PER_USER]: this[DiscountCouponKeys.USER_SPECIFIC].value ? this[DiscountCouponKeys.MAX_USES_PER_USER].value : null,
        // tslint:disable-next-line:max-line-length
        [DiscountCouponKeys.APPROVED_PRODUCT_IDS]: this[DiscountCouponKeys.PRODUCT_SPECIFIC].value ? this[DiscountCouponKeys.APPROVED_PRODUCT_IDS].value : null,
        [DiscountCouponKeys.USE_COUNT]: this.existingCoupon ? this.existingCoupon[DiscountCouponKeys.USE_COUNT] : 0,
        [DiscountCouponKeys.CREATED_DATE]: this.existingCoupon ? this.existingCoupon[DiscountCouponKeys.CREATED_DATE] : moment.now(),
        modifiedDate: moment.now(),
        creatorId: this.existingCoupon ? this.existingCoupon.creatorId : publicUser.id,
        [DiscountCouponKeys.ACTIVE]: this.existingCoupon ? this.existingCoupon[DiscountCouponKeys.ACTIVE] : false,
      };

      this.store$.dispatch(new CouponStoreActions.UpdateCouponRequested({coupon}));

      // Navigate to coupon once save is complete
      this.saveCouponSubscription = this.store$.select(CouponStoreSelectors.selectIsSaving)
        .pipe(
          withLatestFrom(
            this.store$.select(CouponStoreSelectors.selectSaveError)
          )
        )
        .subscribe(([isSaving, saveError]) => {
          if (!isSaving && !saveError) {
            console.log('Coupon saved', coupon);
            this.dialogRef.close();
            this.router.navigate([AdminAppRoutes.COUPONS_COUPON_DETAILS, coupon[DiscountCouponKeys.COUPON_CODE]]);
            this.saveCouponSubscription.unsubscribe();
          }
          if (saveError) {
            console.log('Error saving coupon');
            this.saveCouponSubscription.unsubscribe();
          }
        });
    });
  }

  private calculateExpirationDate(): number {
    // tslint:disable-next-line:max-line-length
    const dateNoTime = moment(this[DiscountCouponKeys.EXPIRATION_DATE].value).format('YYYY-MM-DD'); // Purge time from date value so that it adds properly
    const expDateInMs: number = moment(dateNoTime, 'YYYY-MM-DD').valueOf(); // Convert purged value back to ms

    let expirationHourInMs = 0;
    if (this.expirationHour.value) {
      expirationHourInMs = Number(this.expirationHour.value) * 60 * 60 * 1000;
    }

    let expirationMinInMs = 0;
    if (this.expirationMin.value) {
      expirationMinInMs = Number(this.expirationMin.value) * 60 * 1000;
    }

    const calculatedExpirationTime: number = expDateInMs + expirationHourInMs + expirationMinInMs;

    return calculatedExpirationTime;
  }

  ngOnDestroy() {
    if (this.screenObserverSubscription) {
      this.screenObserverSubscription.unsubscribe();
    }
    if (this.saveCouponSubscription) {
      this.saveCouponSubscription.unsubscribe();
    }
  }



  get [DiscountCouponKeys.COUPON_CODE]() { return this.couponForm.get(DiscountCouponKeys.COUPON_CODE); }
  get [DiscountCouponKeys.DISCOUNT_PERCENTAGE]() { return this.couponForm.get(DiscountCouponKeys.DISCOUNT_PERCENTAGE); }
  get [DiscountCouponKeys.EXPIRATION_DATE]() { return this.couponForm.get(DiscountCouponKeys.EXPIRATION_DATE); }
  get expirationHour() { return this.couponForm.get('expirationHour'); }
  get expirationMin() { return this.couponForm.get('expirationMin'); }
  get [DiscountCouponKeys.MAX_USES]() { return this.couponForm.get(DiscountCouponKeys.MAX_USES); }
  get [DiscountCouponKeys.USER_SPECIFIC]() { return this.couponForm.get(DiscountCouponKeys.USER_SPECIFIC); }
  get [DiscountCouponKeys.PRODUCT_SPECIFIC]() { return this.couponForm.get(DiscountCouponKeys.PRODUCT_SPECIFIC); }
  get [DiscountCouponKeys.MAX_USES_PER_USER]() { return this.couponForm.get(DiscountCouponKeys.MAX_USES_PER_USER); }
  get [DiscountCouponKeys.APPROVED_PRODUCT_IDS]() { return this.couponForm.get(DiscountCouponKeys.APPROVED_PRODUCT_IDS); }

}
