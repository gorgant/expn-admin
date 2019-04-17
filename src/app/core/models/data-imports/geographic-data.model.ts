import { Country } from './country.model';
import { UsState } from './us-state.model';

export interface GeographicData {
  countryList: Country[];
  usStateList: UsState[];
}
