/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductRequest } from './ProductRequest';
import type { ProductSkuRequest } from './ProductSkuRequest';
import type { RequestGuid } from './RequestGuid';
import type { StockRequest } from './StockRequest';
export type SaleDetailRequest = (RequestGuid & {
    product?: ProductRequest;
    productSku?: ProductSkuRequest;
    count: number;
    price: number;
    isExchangeItem: boolean;
    stock?: StockRequest;
});

