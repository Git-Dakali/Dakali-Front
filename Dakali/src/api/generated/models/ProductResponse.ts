/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from './CategoryResponse';
import type { FieldResponse } from './FieldResponse';
import type { ProductColorResponse } from './ProductColorResponse';
import type { ProductSkuResponse } from './ProductSkuResponse';
import type { ResponseCode } from './ResponseCode';
import type { VariantResponse } from './VariantResponse';
export type ProductResponse = (ResponseCode & {
    name: string;
    description: string;
    active: boolean;
    price: number;
    salePrice: number;
    weight: number;
    category?: CategoryResponse;
    fields: Array<FieldResponse>;
    variants: Array<VariantResponse>;
    colors: Array<ProductColorResponse>;
    skus: Array<ProductSkuResponse>;
});

