/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductColorResponse } from './ProductColorResponse';
import type { ProductResponse } from './ProductResponse';
import type { ResponseGuid } from './ResponseGuid';
import type { VariantResponse } from './VariantResponse';
export type ProductSkuResponse = (ResponseGuid & {
    product?: ProductResponse;
    color?: ProductColorResponse;
    variant?: VariantResponse;
    sku: string;
});

