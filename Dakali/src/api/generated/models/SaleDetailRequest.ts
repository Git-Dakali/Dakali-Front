/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductColorRequest } from './ProductColorRequest';
import type { ProductRequest } from './ProductRequest';
import type { RequestGuid } from './RequestGuid';
import type { StockRequest } from './StockRequest';
import type { VariantRequest } from './VariantRequest';
export type SaleDetailRequest = (RequestGuid & {
    product?: ProductRequest;
    variant?: VariantRequest;
    color?: ProductColorRequest;
    count: number;
    price: number;
    isExtra: boolean;
    stock?: StockRequest;
});

