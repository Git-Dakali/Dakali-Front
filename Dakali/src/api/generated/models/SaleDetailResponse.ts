/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductResponse } from './ProductResponse';
import type { ProductSkuResponse } from './ProductSkuResponse';
import type { ResponseGuid } from './ResponseGuid';
import type { StockResponse } from './StockResponse';
export type SaleDetailResponse = (ResponseGuid & {
    product?: ProductResponse;
    productSku?: ProductSkuResponse;
    count: number;
    price: number;
    isExchangeItem: boolean;
    stock?: StockResponse;
});

