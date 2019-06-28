// The Product/Template pair
export interface ProductEmailTemplate {
  templateId: string;
  productId: string;
}

// The object containing any number of Product/Template pairs
export interface ProductEmailTemplateList {
  [key: string]: ProductEmailTemplate;
}
