export enum ProductIdList {
  EXPLEARNING_REMOTE_COACH = '907jvhn4',
  EXPLEARNING_SANDBOX_REMOTE_COACH = 'oq0moyim',
  EXPLEARNING_SANDBOX_ANOTHER_COOL_PRODUCT = 'fpfh8wi9',
  MARY_DAPHNE_REMOTE_COACH = '5fff82ic',
  MARY_DAPHNE_SANDBOX_REMOTE_COACH = 'z37kqtvl',
  MARY_DAPHNE_SANDBOX_ANOTHER_COOL_PRODUCT = 'ml2ke0ak',
}

export enum ProductUrlSlugList {
  REMOTE_COACH = 'remote-coach',
  SANDBOX_REMOTE_COACH = 'remote-coach',
  SANDBOX_ANOTHER_COOL_PRODUCT = 'another-cool-product'
}

// The Product/Template pair
export interface ProductReference {
  productId: string;
  productUrlSlug: string;
}

// The object containing any number of Product/Template pairs
export interface ProductReferenceList {
  [key: string]: ProductReference;
}

// Set the key to the Product ID Searchable by product ID
export const ProductReferenceList: ProductReferenceList = {
  [ProductIdList.EXPLEARNING_REMOTE_COACH]: {
    productId: ProductIdList.EXPLEARNING_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH]: {
    productId: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.SANDBOX_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_SANDBOX_ANOTHER_COOL_PRODUCT]: {
    productId: ProductIdList.EXPLEARNING_SANDBOX_ANOTHER_COOL_PRODUCT,
    productUrlSlug: ProductUrlSlugList.SANDBOX_ANOTHER_COOL_PRODUCT
  },
  [ProductIdList.MARY_DAPHNE_REMOTE_COACH]: {
    productId: ProductIdList.MARY_DAPHNE_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_COACH]: {
    productId: ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.SANDBOX_REMOTE_COACH
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_ANOTHER_COOL_PRODUCT]: {
    productId: ProductIdList.MARY_DAPHNE_SANDBOX_ANOTHER_COOL_PRODUCT,
    productUrlSlug: ProductUrlSlugList.SANDBOX_ANOTHER_COOL_PRODUCT
  }
};
