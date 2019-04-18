export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  checkoutHeader: string;
  description: string;
  mdBlurb: string;
  highlights: string[];
  active: boolean;
}
