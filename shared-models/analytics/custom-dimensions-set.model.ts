import { DataLayerCustomDimensions } from './data-layer-custom-dimensions.model';

// Used in service to ensure even undefined dimensions are marked as such
export type CustomDimensionsSet = {
  [key in DataLayerCustomDimensions]: string | boolean | undefined
};

// Used in component to push partial dimensions to the larger set
export interface PartialCustomDimensionsSet { [key: string]: string | boolean; }
