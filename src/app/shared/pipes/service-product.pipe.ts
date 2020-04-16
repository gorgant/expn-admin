import { Pipe, PipeTransform } from '@angular/core';
import { Product, ProductCategories, ProductKeys } from 'shared-models/products/product.model';

@Pipe({
  name: 'serviceProductPipe'
})
export class ServiceProductPipe implements PipeTransform {

  transform(products: Product[]): Product[] {

    if (!products) {
      return [];
    }

    // Return services sorted by list order
    return products.filter(product =>
      product.productCategory === ProductCategories.SERVICE || !product.productCategory
    ).sort((a, b) =>  b.listOrder - a.listOrder);


  }

}
