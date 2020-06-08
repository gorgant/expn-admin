import { Pipe, PipeTransform } from '@angular/core';
import { Product, ProductCategories, ProductKeys } from 'shared-models/products/product.model';

@Pipe({
  name: 'webcourseProductPipe'
})
export class WebcourseProductPipe implements PipeTransform {

  transform(products: Product[]): Product[] {

    if (!products) {
      return [];
    }

    // Return webcourses sorted by list order (ascending)
    return products.filter(product =>
      product.productCategory === ProductCategories.WEBCOURSE
    ).sort((a, b) =>  a.listOrder - b.listOrder);


  }

}
