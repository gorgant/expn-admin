import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../models/data-imports/country.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryListService {


  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
  ) { }

  updateCountryData(): Observable<Country[]> {

    const countryData$ = this.fetchCountryData(); // This is a local http call
    return countryData$
      .pipe(
        map(countryList => countryList),
        tap(countryList => {
          this.updateDataLocally(countryList);
        })
      );

  }

  private updateDataLocally(countryList: Country[]) {
    const countryDataDoc = this.afs.collection('publicResources').doc('countryData');
    countryDataDoc.set({
      countryList
    }).then(res => {
      console.log('Country data updated', countryList);
    }).catch(error => {
      console.log('Error updating country data', error);
    });
  }

  // Data courtesy of: https://datahub.io/core/country-list
  private fetchCountryData(): Observable<Country[]> {
    return this.http.get('assets/data/country-list-updated.csv', {responseType: 'text'})
      .pipe(
        map(data => {
          const parsedContent = this.parseCSV(data);
          const countryObjectArray = this.convertToCountryObjects(parsedContent);
          return countryObjectArray;
        })
      );
  }

  // Courtesy of: https://stackoverflow.com/a/14991797/6572208
  private parseCSV(str: string): any[] {
    const arr = [];
    let quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
      const cc = str[c];
      const nc = str[c + 1];        // current character, next character
      arr[row] = arr[row] || [];             // create a new row if necessary
      arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

      // If the current character is a quotation mark, and we're inside a
      // quoted field, and the next character is also a quotation mark,
      // add a quotation mark to the current column and skip the next character
      if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }

      // If it's just one quotation mark, begin/end quoted field
      if (cc === '"') { quote = !quote; continue; }

      // If it's a comma and we're not in a quoted field, move on to the next column
      if (cc === ',' && !quote) { ++col; continue; }

      // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
      // and move on to the next row and move to column 0 of that new row
      if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }

      // If it's a newline (LF or CR) and we're not in a quoted field,
      // move on to the next row and move to column 0 of that new row
      if (cc === '\n' && !quote) { ++row; col = 0; continue; }
      if (cc === '\r' && !quote) { ++row; col = 0; continue; }

      // Otherwise, append the current character to the current column
      arr[row][col] += cc;
    }
    return arr;
  }

  private convertToCountryObjects(countryArray: any[]): Country[] {
    const countryObjectArray: Country[] = [];

    countryArray.map(country => {
      const countryObject: Country = {
        name: country[0],
        code: country[1],
        order: Number(country[2])
      };
      countryObjectArray.push(countryObject);
    });

    return countryObjectArray;
  }


}
