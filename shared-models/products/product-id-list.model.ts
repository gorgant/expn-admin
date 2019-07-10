export enum ProductIdList {
  REMOTE_COACH = '907jvhn4',
  SANDBOX_REMOTE_COACH = 'oq0moyim',
  SANDBOX_ANOTHER_COOL_PRODUCT = 'fpfh8wi9'
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
  [ProductIdList.REMOTE_COACH]: {
    productId: ProductIdList.REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH
  },
  [ProductIdList.SANDBOX_REMOTE_COACH]: {
    productId: ProductIdList.SANDBOX_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.SANDBOX_REMOTE_COACH
  },
  [ProductIdList.SANDBOX_ANOTHER_COOL_PRODUCT]: {
    productId: ProductIdList.SANDBOX_ANOTHER_COOL_PRODUCT,
    productUrlSlug: ProductUrlSlugList.SANDBOX_ANOTHER_COOL_PRODUCT
  }
};
