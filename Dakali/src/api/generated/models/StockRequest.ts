/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorRequest } from './ColorRequest';
import type { LocationRequest } from './LocationRequest';
import type { ProductRequest } from './ProductRequest';
import type { RequestGuid } from './RequestGuid';
import type { VariantRequest } from './VariantRequest';
export type StockRequest = (RequestGuid & {
    product: ProductRequest;
    variant: VariantRequest;
    color: ColorRequest;
    location: LocationRequest;
    physical: number;
    reserved: number;
    transit: number;
    free: number;
    minimum: number;
    maximum: number;
});

