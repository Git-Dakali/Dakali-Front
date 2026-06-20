/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocationRequest } from './LocationRequest';
import type { ProductSkuRequest } from './ProductSkuRequest';
import type { RequestGuid } from './RequestGuid';
export type StockRequest = (RequestGuid & {
    productSku?: ProductSkuRequest;
    location?: LocationRequest;
    physical: number;
    reserved: number;
    transit: number;
    free: number;
    minimum: number;
    maximum: number;
});

