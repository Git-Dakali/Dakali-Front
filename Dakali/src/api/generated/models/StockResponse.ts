/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocationResponse } from './LocationResponse';
import type { ProductSkuResponse } from './ProductSkuResponse';
import type { ResponseGuid } from './ResponseGuid';
export type StockResponse = (ResponseGuid & {
    productSku?: ProductSkuResponse;
    location?: LocationResponse;
    physical: number;
    reserved: number;
    transit: number;
    free: number;
    minimum: number;
    maximum: number;
});

