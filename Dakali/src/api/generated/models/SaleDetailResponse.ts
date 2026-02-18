/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductColorResponse } from './ProductColorResponse';
import type { ProductResponse } from './ProductResponse';
import type { ResponseGuid } from './ResponseGuid';
import type { StockResponse } from './StockResponse';
import type { VariantResponse } from './VariantResponse';
export type SaleDetailResponse = (ResponseGuid & {
    product?: ProductResponse;
    variant?: VariantResponse;
    color?: ProductColorResponse;
    count: number;
    price: number;
    isExtra: boolean;
    stock?: StockResponse;
});

