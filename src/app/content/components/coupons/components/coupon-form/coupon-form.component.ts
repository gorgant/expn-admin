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
import { DiscountCouponParent, DiscountCouponQueryFields } from 'shared-models/billing/discount-coupon.model';
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
      [DiscountCouponQueryFields.COUPON_CODE]: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+$/i)]],
      [DiscountCouponQueryFields.DISCOUNT_PERCENTAGE]: ['', [Validators.required, Validators.max(100), Validators.min(1)]],
      [DiscountCouponQueryFields.EXPIRATION_DATE]: [moment.now(), [Validators.required]],
      expirationHour: [0, [Validators.min(0), Validators.max(23)]], // Datepicker doesn't have time of day by default
      expirationMin: [0, [Validators.min(0), Validators.max(59)]], // Datepicker doesn't have time of day by default
      [DiscountCouponQueryFields.MAX_USES]: ['', [Validators.required, Validators.min(1)]],
      [DiscountCouponQueryFields.USER_SPECIFIC]: [false, [Validators.required]],
      [DiscountCouponQueryFields.PRODUCT_SPECIFIC]: [false, [Validators.required]],
      [DiscountCouponQueryFields.MAX_USES_PER_USER]: [null], // Validators set after form is created
      [DiscountCouponQueryFields.APPROVED_PRODUCT_IDS]: [[]]
    });

    this.isNewCoupon = true;

    // Ensures max uses per user doesn't exceed overall max uses
    this.bindMaxUsesPerUserToOverallMaxUses();

  }

  // Configure max uses
  private setMaxUsesPerUserValidators() {
    // Only apply if userSpecific is selected
    if (this.userSpecific.value) {
      const maxValue = this.maxUses.value ? this.maxUses.value : null;
      this.maxUsesPerUser.setValidators([Validators.required, Validators.min(1), Validators.max(maxValue)]);
      this.maxUsesPerUser.updateValueAndValidity();
    }
  }

  private clearMaxUsesPerUserValidators() {
    this.maxUsesPerUser.setValidators(null);
    this.maxUsesPerUser.updateValueAndValidity();
  }


  // Update maxUsesPerUser whenever maxUses is updated
  private bindMaxUsesPerUserToOverallMaxUses() {
    this.maxUses.valueChanges.subscribe(value => {
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
      couponCode: this.existingCoupon.couponCode,
      discountPercentage: this.existingCoupon.discountPercentage * 100,
      expirationDate: this.existingCoupon.expirationDate,
      maxUses: this.existingCoupon.maxUses,
      userSpecific: this.existingCoupon.userSpecific,
      productSpecific: this.existingCoupon.productSpecific,
      maxUsesPerUser: this.existingCoupon.maxUsesPerUser ? this.existingCoupon.maxUsesPerUser : 0,
      approvedProductIds: this.existingCoupon.approvedProductIds ? this.existingCoupon.approvedProductIds : []
    };

    // Convert the datestring to segments to fill form fields properly
    const dateString = this.existingCoupon[DiscountCouponQueryFields.EXPIRATION_DATE];
    const patchFormDataWithDatePickerFormats = {
      ...patchFormData,
      expirationDate: moment(dateString),
      expirationHour: moment(dateString).hours(),
      expirationMin: moment(dateString).minutes()
    };


    this.couponForm.patchValue(patchFormDataWithDatePickerFormats);
    this.couponCode.disable(); // Prevent code from being edited

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
        couponCode: (this.couponCode.value as string).trim(),
        discountPercentage: this.discountPercentage.value / 100,
        expirationDate: this.calculateExpirationDate(),
        maxUses: this.maxUses.value,
        userSpecific: this.userSpecific.value,
        productSpecific: this.productSpecific.value,
        maxUsesPerUser: this.userSpecific.value ? this.maxUsesPerUser.value : null,
        approvedProductIds: this.productSpecific.value ? this.approvedProductIds.value : null,
        useCount: this.existingCoupon ? this.existingCoupon.useCount : 0,
        createdDate: this.existingCoupon ? this.existingCoupon.createdDate : moment.now(),
        modifiedDate: moment.now(),
        creatorId: this.existingCoupon ? this.existingCoupon.creatorId : publicUser.id,
        active: this.existingCoupon ? this.existingCoupon.active : false,
      };

      this.store$.dispatch(new CouponStoreActions.UpdateCouponRequested({coupon}));

      // Navigate to coupon once save is complete
      this.saveCouponSubscription = this.store$.select(CouponStoreSelectors.selectIsSaving)
        .pipe(
          withLatestFrom(
            this.store$.select(CouponStoreSelectors.selectCouponSaved),
            this.store$.select(CouponStoreSelectors.selectSaveError)
          )
        )
        .subscribe(([isSaving, couponUpdated, saveError]) => {
          if (!isSaving && couponUpdated) {
            console.log('Coupon saved', coupon);
            this.dialogRef.close();
            this.router.navigate([AdminAppRoutes.COUPONS_COUPON_DETAILS, coupon.couponCode]);
          }
          if (saveError) {
            console.log('Error saving coupon');
          }
        });
    });
  }

  private calculateExpirationDate(): number {
    const dateNoTime = moment(this.expirationDate.value).format('YYYY-MM-DD'); // Purge time from date value so that it adds properly
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



  get couponCode() { return this.couponForm.get(DiscountCouponQueryFields.COUPON_CODE); }
  get discountPercentage() { return this.couponForm.get(DiscountCouponQueryFields.DISCOUNT_PERCENTAGE); }
  get expirationDate() { return this.couponForm.get(DiscountCouponQueryFields.EXPIRATION_DATE); }
  get expirationHour() { return this.couponForm.get('expirationHour'); }
  get expirationMin() { return this.couponForm.get('expirationMin'); }
  get maxUses() { return this.couponForm.get(DiscountCouponQueryFields.MAX_USES); }
  get userSpecific() { return this.couponForm.get(DiscountCouponQueryFields.USER_SPECIFIC); }
  get productSpecific() { return this.couponForm.get(DiscountCouponQueryFields.PRODUCT_SPECIFIC); }
  get maxUsesPerUser() { return this.couponForm.get(DiscountCouponQueryFields.MAX_USES_PER_USER); }
  get approvedProductIds() { return this.couponForm.get(DiscountCouponQueryFields.APPROVED_PRODUCT_IDS); }

}
