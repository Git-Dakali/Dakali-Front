/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorResponse } from './ColorResponse';
import type { ProductResponse } from './ProductResponse';
import type { ResponseGuid } from './ResponseGuid';
import type { StockStateResponse } from './StockStateResponse';
import type { VariantResponse } from './VariantResponse';
export type StockResponse = (ResponseGuid & {
    product: ProductResponse;
    variant: VariantResponse;
    color: ColorResponse;
    physical: number;
    reserved: number;
    transit: number;
    free: number;
    minimum: number;
    maximum: number;
    state: StockStateResponse;
});

